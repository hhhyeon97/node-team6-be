const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/login', authController.loginWithEmail);
router.post('/google', authController.loginWithGoogle);
// router.post('/kakao', authController.loginWithKakao);

// router.get('/kakao/login', authController.getKakaoLoginUrl);
// router.get('/kakao/callback', authController.kakaoCallback);

// router.get('/kakao', authController.kakaoLoginTest);

router.get('/kakao/callback', authController.kakaoCallback);

module.exports = router;
