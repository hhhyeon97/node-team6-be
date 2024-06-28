const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    level: { type: String, default: 'gold' }, // 4types: normal, gold, suspend, admin
    image: { type: String, default: '' },
    contact: { type: String, default: '' },
    // 비밀번호 재설정 토큰
    resetPasswordToken: { type: String, default: undefined },
    // 비밀번호 재설정 토큰 만료 시간
    resetPasswordExpires: { type: Date, default: undefined },
  },
  { timestamps: true },
);

userSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.password;
  delete obj.__v;
  delete obj.updatedAt;
  return obj;
};

userSchema.methods.generateToken = async function () {
  const token = await jwt.sign({ _id: this.id }, JWT_SECRET_KEY, {
    expiresIn: '1d',
  });
  return token;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
