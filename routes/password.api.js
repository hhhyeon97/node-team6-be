const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/password.controller');

// 비밀번호 재발급 요청
router.post('/forgot-password', passwordController.forgotPassword);

// 비밀번호 재설정
router.post('/reset-password/:token', passwordController.resetPassword);

module.exports = router;
