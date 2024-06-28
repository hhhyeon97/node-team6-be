const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const authController = require('../controllers/auth.controller');

router.get("/all", reviewController.getAllReviewList);

// mypage
router.get("/my", authController.authenticate, reviewController.getMyReviewList);
router.post("/", authController.authenticate, reviewController.createReview);
router.put("/", authController.authenticate, reviewController.editReview);
router.delete("/:id", authController.authenticate, reviewController.deleteReview);

// admin
router.get("/", 
  authController.authenticate, 
  authController.checkAdminPermission, 
  reviewController.getReviewList);
router.put("/:id", 
  authController.authenticate, 
  authController.checkAdminPermission,
  reviewController.editReviewState);

module.exports = router;