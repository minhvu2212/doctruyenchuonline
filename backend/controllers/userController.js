const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const Token = require('../models/Token');
const Story = require("../models/Story");
// Đăng ký người dùng mới
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Kiểm tra người dùng đã tồn tại chưa
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Tạo người dùng mới
    const newUser = new User({ username, password });
    await newUser.save();
    console.log('User registered successfully:', newUser);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Đăng nhập và tạo token
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Kiểm tra người dùng có tồn tại không
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // So sánh mật khẩu
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Tạo token với thông tin người dùng và isAdmin
    const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, config.jwtSecret, { expiresIn: '72h' });
    console.log('User logged in successfully:', user);

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getProfile = async (req, res) => {
  try {
    const userId = req.verifiedUser._id;

    // Tìm người dùng trong cơ sở dữ liệu dựa trên userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Trả về thông tin hồ sơ người dùng (loại bỏ mật khẩu trước khi gửi lại)
    res.status(200).json({
      _id: user._id,
      username: user.username,
      // Bạn có thể thêm các trường thông tin hồ sơ khác tại đây nếu cần
    });
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
// Cập nhật hồ sơ người dùng
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.verifiedUser.userId;
    const updates = req.body;

    await User.findByIdAndUpdate(userId, updates);
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Đăng xuất và xử lý token
// Đăng xuất và xử lý token
exports.logout = async (req, res) => {
  try {
    // Token được gửi từ client trong header Authorization
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(400).json({ message: 'Token not found in request headers' });
    }

    // Thêm token vào blacklist hoặc xử lý khác để đánh dấu token là không hợp lệ
    await addToBlacklist(token);

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error logging out:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Hàm để thêm token vào danh sách đen
const addToBlacklist = async (token) => {
  // Tạo một bản ghi trong cơ sở dữ liệu chứa token đã hết hạn
  // Ví dụ: sử dụng mô hình TokenSchema để lưu trữ token
  const tokenDocument = new Token({ token });
  await tokenDocument.save();
};

