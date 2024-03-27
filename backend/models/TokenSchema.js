// TokenSchema.js
const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(+new Date() + 24*60*60*1000), // 24 hours from now
    index: { expires: '1d' } // 1 day after `expiresAt`
  }
});

const Token = mongoose.model('Token', tokenSchema, 'Token');

module.exports = Token;