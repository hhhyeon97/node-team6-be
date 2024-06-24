const express = require('express');
const router = express.Router();
const userApi = require('./user.api');
const reviewApi = require('./review.api');
const authApi = require('./auth.api');
const noticeApi = require('./notice.api');

router.use('/user', userApi);
router.use('/review', reviewApi);
router.use('/auth', authApi);
router.use('/notice', noticeApi);

module.exports = router;
