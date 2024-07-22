const User = require('../models/User');
const bcrypt = require('bcryptjs');
const authController = {};
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const { KAKAO_REST_API_KEY, KAKAO_REDIRECT_URI } = process.env;

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

// authController.loginWithGoogle = async (req, res) => {
//   try {
//     // 토큰 읽어오기
//     const { token } = req.body;
//     const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
//     const ticket = await googleClient.verifyIdToken({
//       idToken: token,
//       audience: GOOGLE_CLIENT_ID,
//     });

//     const { email, name } = ticket.getPayload();
//     console.log('이메일과 이름 !', email, name);
//     let user = await User.findOne({ email });
//     if (!user) {
//       // 처음 로그인 한 유저의 경우 회원가입 먼저 진행

//       const randomPassword = '' + Math.floor(Math.random() * 1000000);
//       const salt = await bcrypt.genSalt(10);
//       const newPassword = await bcrypt.hash(randomPassword, salt);

//       user = new User({
//         name,
//         email,
//         password: newPassword,
//       });
//       await user.save();
//     }
//     const localToken = await user.generateToken();
//     res.status(200).json({ status: 'success', user, token: localToken });
//   } catch (error) {
//     res.status(400).json({ status: 'fail', error: error.message });
//     console.log('에러', error.message);
//   }
// };

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

// authController.loginWithKakao = async (req, res) => {
//   const { token } = req.body;
//   // console.log('토큰 확인', token);
//   try {
//     const kakaoResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const kakaoProfile = kakaoResponse.data;
//     console.log('프로필 확인', kakaoProfile);
//     const { kakao_account, properties } = kakaoProfile;
//     const email = kakao_account.email;
//     const name = properties.nickname;

//     let user = await User.findOne({ email });
//     if (!user) {
//       const randomPassword = '' + Math.floor(Math.random() * 1000000);
//       const salt = await bcrypt.genSalt(10);
//       const newPassword = await bcrypt.hash(randomPassword, salt);

//       user = new User({
//         name,
//         email,
//         password: newPassword,
//       });
//       await user.save();
//     }

//     const localToken = await user.generateToken();
//     res.status(200).json({ status: 'success', user, token: localToken });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: '카카오 로그인에 실패하였습니다.' });
//   }
// };

// authController.kakaoCallback = async (req, res) => {
//   const { code } = req.query;
//   try {
//     console.log('Received authorization code:', code);

//     // 카카오 토큰 요청
//     const tokenResponse = await axios.post(
//       'https://kauth.kakao.com/oauth/token',
//       null,
//       {
//         params: {
//           grant_type: 'authorization_code',
//           client_id: KAKAO_REST_API_KEY,
//           redirect_uri: KAKAO_REDIRECT_URI,
//           code,
//         },
//       },
//     );

//     console.log('Token response:', tokenResponse.data);

//     const { access_token } = tokenResponse.data;

//     // 카카오 사용자 정보 요청
//     const kakaoResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
//       headers: {
//         Authorization: `Bearer ${access_token}`,
//       },
//     });

//     console.log('User info response:', kakaoResponse.data);

//     const kakaoProfile = kakaoResponse.data;
//     const { kakao_account, properties } = kakaoProfile;
//     const email = kakao_account.email;
//     const name = properties.nickname;

//     let user = await User.findOne({ email });
//     if (!user) {
//       const randomPassword = '' + Math.floor(Math.random() * 1000000);
//       const salt = await bcrypt.genSalt(10);
//       const newPassword = await bcrypt.hash(randomPassword, salt);

//       user = new User({
//         name,
//         email,
//         password: newPassword,
//       });
//       await user.save();
//     }

//     const localToken = await user.generateToken();
//     res.status(200).json({ status: 'success', user, token: localToken });
//   } catch (error) {
//     console.error('Error during Kakao callback:', error);
//     res.status(500).json({
//       error: '카카오 로그인에 실패하였습니다.',
//       details: error.message,
//     });
//   }
// };

// ========= test

// authController.kakaoLoginTest = async (req, res) => {
//   let REST_API_KEY = 'b205ba37d37752cd1feaa0421a8bfb5a';
//   let REDIRECT_URI = 'http://localhost:3000/api/auth/kakao';

//   // 카카오 로그인 시, 쿼리스트링으로 전달되는 CODE의 값(인가코드)
//   let code = req.query.code;

//   console.log('코드', code);
//   // CODE 값을 Kakao server로 전달하여 엑세스 토큰 반환 받기

//   axios
//     .post('https://kauth.kakao.com/oauth/token', null, {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       params: {
//         grant_type: 'authorization_code',
//         client_id: REST_API_KEY,
//         redirect_uri: REDIRECT_URI,
//         code: code,
//       },
//     })
//     .then((response) => {
//       // 반환받은 엑세스 토큰으로 사용자 정보 반환 받기
//       let accessToken = response.data.access_token;
//       axios
//         .get('https://kapi.kakao.com/v2/user/me', {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
//           },
//         })
//         .then((res) => {
//           console.log(res.data);
//         });
//     });
// };

// test

const { KAKAO_REST_API_KEY, KAKAO_REDIRECT_URI } = process.env;

authController.kakaoCallback = async (req, res) => {
  const { code } = req.query;
  try {
    console.log('Received authorization code:', code);

    const tokenResponse = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          client_id: KAKAO_REST_API_KEY,
          redirect_uri: KAKAO_REDIRECT_URI,
          code,
        },
      },
    );

    console.log('Token response:', tokenResponse.data);

    const { access_token } = tokenResponse.data;

    const kakaoResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    console.log('User info response:', kakaoResponse.data);

    const kakaoProfile = kakaoResponse.data;
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
    console.error('Error during Kakao callback:', error);
    res
      .status(500)
      .json({
        error: '카카오 로그인에 실패하였습니다.',
        details: error.message,
      });
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
