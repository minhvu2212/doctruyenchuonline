const jwt = require('jsonwebtoken');
const config = require('../config');
const Token = require('../models/TokenSchema'); // Đường dẫn tới file TokenSchema.js

// Thêm token vào danh sách token không còn hợp lệ
const clearToken = async (token) => {
  const tokenDocument = new Token({ token });
  await tokenDocument.save();
};

// Kiểm tra xem token có nằm trong danh sách token không còn hợp lệ không
const isTokenBlacklisted = async (token) => {
  const tokenFound = await Token.findOne({ token });
  return !!tokenFound;
};

// Tạo JWT token
const generateToken = (user) => {
  // Đảm bảo rằng user có trường isAdmin
  const payload = {
    userId: user._id,
    isAdmin: user.isAdmin
  };
  // Tạo token
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '24h' });
};

// Xác thực JWT token
const verifyToken = (token) => {
  // Xác thực token và trả về payload
  return jwt.verify(token, config.jwtSecret);
};

module.exports = { clearToken, isTokenBlacklisted, generateToken, verifyToken };