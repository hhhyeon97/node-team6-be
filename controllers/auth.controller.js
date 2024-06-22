const User = require('../models/User');
const bcrypt = require('bcryptjs');
const authController = {};
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;
const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;

authController.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        // 로그인 정보 일치시 token 발급
        const token = await user.generateToken();
        return res.status(200).json({ status: 'success', user, token });
      }
    }
    throw new Error('이메일 혹은 비밀번호가 잘못되었습니다!');
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

authController.loginWithGoogle = async (req, res) => {
  try {
    // 토큰 읽어오기
    const { token } = req.body;
    const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();
    console.log('이메일과 이름 !', email, name);
    let user = await User.findOne({ email });
    if (!user) {
      // 처음 로그인 한 유저의 경우 회원가입 먼저 진행

      const randomPassword = '' + Math.floor(Math.random() * 1000000);
      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(randomPassword, salt);

      user = new User({
        name,
        email,
        password: newPassword,
        contact: '', // 구글로그인시 이메일, 이름만 가져옴 - > 번호는 기본값 설정
      });
      await user.save();
    }
    const localToken = await user.generateToken();
    res.status(200).json({ status: 'success', user, token: localToken });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
    console.log('에러', error.message);
  }
};

authController.loginWithKakao = async (req, res) => {
  const { token } = req.body;
  console.log('토큰 왔니 ?...', token);
  try {
    const kakaoResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const kakaoProfile = kakaoResponse.data;
    console.log('프로필 확인', kakaoProfile);
    const { id, kakao_account, properties } = kakaoProfile;
    const email = kakao_account.email;
    const name = properties.nickname;

    let user = await User.findOne({ email });
    if (!user) {
      const randomPassword = '' + Math.floor(Math.random() * 1000000);
      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(randomPassword, salt);

      user = new User({
        name,
        email,
        password: newPassword,
        contact: '',
      });
      await user.save();
    }

    // const userPayload = {
    //   id: user._id,
    //   email: user.email,
    //   name: user.name,
    // };

    // const jwtToken = jwt.sign(userPayload, JWT_SECRET_KEY, {
    //   expiresIn: '1d',
    // });

    // res.status(200).json({ status: 'success', user, token: jwtToken });
    const localToken = await user.generateToken();
    res.status(200).json({ status: 'success', user, token: localToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '카카오 로그인 실패' });
  }
};

authController.loginWithKakaoCode = async (req, res) => {
  try {
    const { code } = req.body;

    // 인가 코드로 액세스 토큰 발급
    const tokenResponse = await axios.post(
      `https://kauth.kakao.com/oauth/token`,
      null,
      {
        params: {
          grant_type: 'authorization_code',
          client_id: KAKAO_REST_API_KEY,
          redirect_uri: KAKAO_REDIRECT_URI,
          code: code,
        },
      },
    );

    const { access_token } = tokenResponse.data;

    // 액세스 토큰으로 유저 정보 조회
    const userResponse = await axios.get(`https://kapi.kakao.com/v2/user/me`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const { id, properties, kakao_account } = userResponse.data;

    // DB에 유저 저장 또는 업데이트
    let user = await User.findOne({ kakaoId: id });
    if (!user) {
      user = await User.create({
        kakaoId: id,
        email: kakao_account.email,
        nickname: properties.nickname,
      });
    }

    // JWT 토큰 생성
    // const token = jwt.sign(
    //   { id: user._id, email: user.email },
    //   JWT_SECRET_KEY,
    //   { expiresIn: '1h' },
    // );

    // res.status(200).json({ token });

    const token = await user.generateToken();
    res.status(200).json({ status: 'success', user, token: token });
  } catch (error) {
    console.error(error);
    // res.status(500).json({ error: '로그인에 실패했습니다.' });
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

authController.loginKakao = async (req, res) => {
  // 카카오 로그인 시, 쿼리스트링으로 전달되는 CODE의 값(인가코드)
  let code = req.query.code;
  // CODE 값을 Kakao server로 전달하여 엑세스 토큰 반환 받기
  axios
    .post('https://kauth.kakao.com/oauth/token', null, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: {
        grant_type: 'authorization_code',
        client_id: KAKAO_REST_API_KEY,
        redirect_uri: KAKAO_REDIRECT_URI,
        code: code,
      },
    })
    .then((response) => {
      // console.log(response);
      console.log(response.data.access_token);
    });
};

authController.authenticate = async (req, res, next) => {
  try {
    const tokenString = req.header.authorization;
    if (!tokenString) throw new Error('Token not found.');
    const token = tokenString.replace('Bearer ', '');
    jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
      if (error) throw new Error('Invalid token');
      req.userId = payload._id;
    });
    next();
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

module.exports = authController;
