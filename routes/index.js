const express = require('express');
const router = express.Router();
const userApi = require('./user.api');
const reviewApi = require('./review.api');

router.use('/user', userApi);
router.use('/review', reviewApi);

module.exports = router;
