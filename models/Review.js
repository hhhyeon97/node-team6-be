const mongoose = require("mongoose")
const Schema = mongoose.Schema
const User = require('./User');
// const Reservation = require('./Reservation');

const reviewSchema = Schema({
  // userId: {
  //   type: mongoose.ObjectId,
  //   ref: User
  // },
  // reservationId: {
  //   type: mongoose.ObjectId,
  //   ref: Reservation
  // },
  reviewText: {
    type: String,
    required: true
  },
  starRate: {
    type: Number,
    default: 0,
    required: true
  },
  image: {
    type: String
  },
  isSuspended: {
    type: Boolean,
    default: false
  }
},{timestamps: true});

reviewSchema.methods.toJSON = function (){
  const obj = this._doc // this._doc = review 데이터 하나
  delete obj.__v
  delete obj.updateAt
  delete obj.createAt
  return obj
}

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;

