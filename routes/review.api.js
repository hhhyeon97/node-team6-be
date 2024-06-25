const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const authController = require('../controllers/auth.controller');

router.post("/",  authController.authenticate, reviewController.createReview);
// admin
router.get("/", reviewController.getReviewList);

module.exports = router;