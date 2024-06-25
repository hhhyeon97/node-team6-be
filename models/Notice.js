const mongoose = require("mongoose")
const Schema = mongoose.Schema
const User = require('../models/User');

const noticeSchema = Schema({
  userId: {
    type: mongoose.ObjectId,
    ref: User
  },
  title:{
    type: String,
    required: true  
  },
  content:{
    type: String,
    required: true
  },
  img: {
    type: String
  },
  views: {
    type: Number
  },
  isImportant: {
    type: Boolean,
    default: false
  }
},{timestamps: true});

noticeSchema.methods.toJSON = function (){
  const obj = this._doc 
  delete obj.__v
  delete obj.updateAt
  delete obj.createAt
  return obj
}

const Notice = mongoose.model("Notice", noticeSchema);
module.exports = Notice;