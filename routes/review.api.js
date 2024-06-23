const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');

// router.post('/', reviewController.createReview);
router.post("/", reviewController.createReview);
// admin
router.get("/", reviewController.getReviewList);

module.exports = router;