const express = require('express');
const authController = require('../controllers/auth.controller');
const likeController = require('../controllers/like.controller');
const router = express.Router();

//나중에 권한 확인 미들웨어 추가할 것
router.post('/',authController.authenticate,likeController.addLikeToList);
router.get('/',authController.authenticate,likeController.getLikeListById);
router.delete('/:id',authController.authenticate,likeController.deleteLikeItem);

module.exports=router;