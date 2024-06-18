const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');

// router.post('/', reviewController.createReview);
router.post("/", (req, res)=>{
  res.send("create review");
})

module.exports = router;