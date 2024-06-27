const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const authController = require('../controllers/auth.controller');

router.post("/", authController.authenticate, reviewController.createReview);
// router.get("/check/:reserveId", authController.authenticate, reviewController.checkReviewed)
// admin

router.get("/", reviewController.getReviewList);
router.get("/all", reviewController.getAllReviewList);
router.get("/my", authController.authenticate, reviewController.getMyReviewList);

module.exports = router;