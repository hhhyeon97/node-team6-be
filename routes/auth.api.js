const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/login', authController.loginWithEmail);
router.post('/google', authController.loginWithGoogle);
router.post('/kakao', authController.loginWithKakao);
router.get('/naver/callback', authController.naverCallback);

module.exports = router;
