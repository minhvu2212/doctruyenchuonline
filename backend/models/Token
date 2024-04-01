const mongoose = require('mongoose');

// Định nghĩa schema cho token
const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: '24h' } // Tự động xóa token sau 24 giờ
});

// Tạo model từ schema
const Token = mongoose.model('Token', tokenSchema, 'Token');

module.exports = Token;
