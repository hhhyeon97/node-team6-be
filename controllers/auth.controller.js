const User = require('../models/User');
const bcrypt = require('bcryptjs');
const authController = {};
const jwt = require('jsonwebtoken');
require('dotenv').config();
const axios = require('axios');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { KAKAO_REST_API_KEY, KAKAO_REDIRECT_URI } = process.env;
const { NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, NAVER_REDIRECT_URI } =
  process.env;

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
    const { token } = req.body;

    const googleUserData = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    );

    const { email, name } = googleUserData.data;
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
  // console.log('토큰 확인', token);
  try {
    const kakaoResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const kakaoProfile = kakaoResponse.data;
    console.log('프로필 확인', kakaoProfile);
    const { kakao_account, properties } = kakaoProfile;
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
      });
      await user.save();
    }

    const localToken = await user.generateToken();
    res.status(200).json({ status: 'success', user, token: localToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '카카오 로그인에 실패하였습니다.' });
  }
};

authController.naverCallback = async (req, res) => {
  const { code, state } = req.query;
  try {
    const tokenResponse = await axios.post(
      `https://nid.naver.com/oauth2.0/token`,
      null,
      {
        params: {
          grant_type: 'authorization_code',
          client_id: NAVER_CLIENT_ID,
          client_secret: NAVER_CLIENT_SECRET,
          redirect_uri: NAVER_REDIRECT_URI,
          code,
          state,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    const { access_token } = tokenResponse.data;
    const naverResponse = await axios.get(
      'https://openapi.naver.com/v1/nid/me',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    const naverProfile = naverResponse.data.response;
    const { email, nickname } = naverProfile;

    let user = await User.findOne({ email });
    if (!user) {
      const randomPassword = '' + Math.floor(Math.random() * 1000000);
      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(randomPassword, salt);

      user = new User({
        name: nickname,
        email,
        password: newPassword,
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

authController.authenticate = async (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
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

authController.checkAdminPermission = async (req, res, next) => {
  try {
    // token으로 찾아낸 userId 값을 authenticate에서 받아 온다.
    const { userId } = req;
    const user = await User.findById(userId);
    if (user.level !== 'admin') throw new Error('관리자 권한이 없습니다.');
    next();
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

module.exports = authController;
