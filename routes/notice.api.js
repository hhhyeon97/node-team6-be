const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const noticeController = require('../controllers/notice.controller');

router.post(
  '/',
  authController.authenticate,
  authController.checkAdminPermission,
  noticeController.createNotice,
);
router.get(
  '/',
  authController.authenticate,
  authController.checkAdminPermission,
  noticeController.getNoticeList,
);
router.put(
  '/:id',
  authController.authenticate,
  authController.checkAdminPermission,
  noticeController.editNotice,
);
router.delete(
  '/:id',
  authController.authenticate,
  authController.checkAdminPermission,
  noticeController.deleteNotice,
);

router.get('/user-notice', noticeController.getNoticeList);

module.exports = router;
