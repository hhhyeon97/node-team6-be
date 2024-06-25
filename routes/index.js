const express = require('express');
const router = express.Router();
const userApi = require('./user.api');
const reviewApi = require('./review.api');
const authApi = require('./auth.api');
const passwordApi = require('./password.api');
const noticeApi = require('./notice.api');
const reserveApi = require('./reserve.api');
const likeApi = require('./like.api');

router.use('/user', userApi);
router.use('/review', reviewApi);
router.use('/auth', authApi);
router.use('/password', passwordApi);
router.use('/notice', noticeApi);
router.use('/reserve', reserveApi)
router.use('/like',likeApi);

module.exports = router;
