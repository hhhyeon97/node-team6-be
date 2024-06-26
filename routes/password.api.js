const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/password.controller');
const authController = require('../controllers/auth.controller');

// 비밀번호 재발급 요청
router.post('/forgot-password', passwordController.forgotPassword);

// 비밀번호 재설정 토큰 확인 및 비밀번호 재설정
router.post(
  '/reset-password/:token',
  passwordController.checkResetToken,
  passwordController.resetPassword,
);

// 마이페이지 - > 비밀번호 수정
router.put(
  '/change-password',
  authController.authenticate,
  passwordController.changePassword,
);

module.exports = router;
