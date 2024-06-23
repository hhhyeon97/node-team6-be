const User = require('../models/User');
const bcrypt = require('bcryptjs');

const userController = {};

userController.createUser = async (req, res) => {
  try {
    let { email, password, name, level, image, contact } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw new Error('이미 가입된 사용자입니다!');
    }
    const salt = await bcrypt.genSaltSync(10);
    password = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password,
      name,
      level: level ? level : 'normal',
      image,
      contact,
    });
    await newUser.save();
    return res.status(200).json({ status: 'success' });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

userController.getUser = async (req, res) => {
  try {
    const { userId } = req;
    console.log('userID', userId)
    const user = await User.findById(userId);
    if (user) {
      return res.status(200).json({ status: 'success', user });
    }
    throw new Error('Invalid token');
  } catch (error) {
    res.status(400).json({ status: 'error', error: error.message });
  }
};

// 전체 회원리스트  가져오기 (admin)
userController.getUserList = async (req, res) => {
  try {
    const userList = await User.find();
    res.status(200).json({ status: "success", data: userList })
  } catch (error) {
    res.status(400).json({ status: 'error', error: error.message });
  }
}

module.exports = userController;
