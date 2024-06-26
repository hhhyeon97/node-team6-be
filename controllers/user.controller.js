const User = require('../models/User');
const Review = require('../models/Review');
const Reservation = require('../models/Reservation');
const Like = require('../models/Like');
const Notice = require('../models/Notice');

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
      level: level ? level : 'gold',
      image,
      contact,
    });
    await newUser.save();
    return res.status(200).json({ status: 'success' });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// [ 회원 정보 가져오기 ]
userController.getUser = async (req, res) => {
  try {
    const { userId } = req;
    console.log('userID', userId);
    const user = await User.findById(userId);
    if (user) {
      return res.status(200).json({ status: 'success', user });
    }
    throw new Error('Invalid token');
  } catch (error) {
    res.status(400).json({ status: 'error', error: error.message });
  }
};

// [ 회원 정보 수정하기 ]
userController.editUser = async (req, res) => {
  try {
    const { userId } = req;
    const { image, name, email, contact } = req.body;

    // 이메일 유효성 검사
    if (!validateEmail(email)) {
      throw new Error('유효하지 않은 이메일 형식입니다.');
    }

    // 이메일 중복 확인
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id != userId) {
      // 현재 수정중인 사용자가 아니면서 이미 존재하는 경우
      throw new Error('이미 사용 중인 이메일 주소입니다.');
    }

    // 패스워드 암호화
    // const salt = await bcrypt.genSaltSync(10);
    // password = await bcrypt.hash(password, salt);

    const user = await User.findByIdAndUpdate(
      userId,
      { image, name, email, contact },
      { new: true },
    );
    if (!user) throw new Error('회원이 존재하지 않습니다');
    res.status(200).json({ status: 'success', data: user });
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
      ...(name && { name: { $regex: name, $options: 'i' } }),
      level: { $ne: 'admin' }, // admin 회원은 리스트에서 제외
    };
    let query = User.find(cond).sort({ createdAt: -1 });
    let response = { status: 'success' };

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
    throw new Error('회원이 없거나 잘못되었습니다');
  } catch (error) {
    res.status(400).json({ status: 'error', error: error.message });
  }
};

// [ 유저 레벨 수정하기 (admin) ]
userController.updateUserLevel = async (req, res) => {
  try {
    const userId = req.params.id;
    const { level } = req.body;
    const user = await User.findByIdAndUpdate(userId, { level }, { new: true });
    if (!user) throw new Error('회원이 존재하지 않습니다');
    res.status(200).json({ status: 'success', data: user });
  } catch {
    res.status(400).json({ status: 'error', error: error.message });
  }
};

// [ 회원 탈퇴 ]
userController.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);
    if (!user) throw new Error('해당 유저가 존재하지 않습니다');

    await User.deleteMany({ userId });
    await Review.deleteMany({ userId });
    await Reservation.deleteMany({ userId });
    await Like.deleteMany({ userId });
    await Notice.deleteMany({ userId });

    res
      .status(200)
      .json({
        status: 'success',
        message: '회원 탈퇴가 성공적으로 처리되었습니다',
      });
  } catch (error) {
    res.status(400).json({ status: 'error', error: error.message });
  }
};

function validateEmail(email) {
  // 간단한 이메일 형식 검사 예시
  const re = /.+@.+/;
  return re.test(email);
}

module.exports = userController;
