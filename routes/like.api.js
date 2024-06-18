const express = require('express');
// const authController = require('/')
const likeController = require('../controllers/like.controller');
const router = express.Router();

//나중에 권한 확인 미들웨어 추가할 것
router.post('/',likeController.createLike);
router.get('/',likeController.getLikeItems);

module.exports=router;