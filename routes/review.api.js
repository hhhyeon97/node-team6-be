const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const authController = require('../controllers/auth.controller');

router.post("/", authController.authenticate, reviewController.createReview);
//체크 기능을 쓰지 않아도 되어서 주석처리했슴당 ..
// router.get("/check/:reserveId", authController.authenticate, reviewController.checkReviewed)
// admin

router.get("/", reviewController.getReviewList);
router.get("/all", reviewController.getAllReviewList);
router.get("/my", authController.authenticate, reviewController.getMyReviewList);

module.exports = router;