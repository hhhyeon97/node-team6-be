const User = require('../models/User');

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
    res.status(200).json({ status: 'success', error: error.message });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

module.exports = userController;
