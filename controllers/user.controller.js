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

// [ 전체 회원리스트 가져오기 (admin) ]
userController.getUserList = async (req, res) => {
  try {
    const PAGE_SIZE = 5;
    const { page, name } = req.query;
    const cond = {
      ...name && { name: { $regex: name, $options: "i" } },
      level: { $ne: 'admin' } // admin 회원은 리스트에서 제외
    };
    let query = User.find(cond).sort({ createdAt: -1 });
    let response = { status: "success" };

    if (page) {
      query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
      const totalItemNum = await User.find(cond).count();
      const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
      response.totalPageNum = totalPageNum;
    }

    const userList = await query.exec();
    response.data = userList;

    if (userList) {
      return res.status(200).json(response);
    }
    throw new Error("회원이 없거나 잘못되었습니다");

  } catch (error) {
    res.status(400).json({ status: 'error', error: error.message });
  }
}

// [ 유저 레벨 수정하기 (admin) ]
userController.updateUserLevel = async (req, res) => {
  try {
    const userId = req.params.id;
    const { level } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { level },
      { new: true }
    );
    if (!user) throw new Error("회원이 존재하지 않습니다");
    res.status(200).json({ status: "success", data: user });

  } catch {
    res.status(400).json({ status: 'error', error: error.message });
  }
}



module.exports = userController;
