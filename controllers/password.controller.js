const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const nodemailer = require('nodemailer');
require('dotenv').config();

const passwordController = {};

// 비밀번호 재발급 요청
passwordController.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('해당 이메일로 가입된 사용자가 없습니다.');
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1시간 유효
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: 'passwordreset@demo.com',
      subject: '비밀번호 재설정 요청',
      text: `다음 링크를 클릭하여 비밀번호를 재설정하세요:\n\n
        http://${req.headers.host}/reset-password/${token}\n\n
        만약 본인이 요청한 것이 아니라면 이 이메일을 무시하세요.`,
    };

    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ status: 'success', message: '재설정 이메일이 발송되었습니다.' });
  } catch (error) {
    res.status(400).json({ status: 'error', error: error.message });
  }
};

// 비밀번호 재설정
passwordController.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      throw new Error('토큰이 유효하지 않거나 만료되었습니다.');
    }

    const salt = await bcrypt.genSaltSync(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: '비밀번호가 성공적으로 재설정되었습니다.',
    });
  } catch (error) {
    res.status(400).json({ status: 'error', error: error.message });
  }
};

module.exports = passwordController;
