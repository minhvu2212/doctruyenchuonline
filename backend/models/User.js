const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: {
    type: Boolean,
    default: false, // Giá trị mặc định là false cho người dùng thông thường
  },
});

const User = mongoose.model('User', userSchema, 'User');

module.exports = User;
