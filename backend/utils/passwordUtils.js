const bcrypt = require('bcrypt');

/**
 * Hash a password using bcrypt
 * @param {string} password - The password to hash
 * @returns {Promise<string>} - The hashed password
 */
const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Sử dụng bcrypt để hash mật khẩu với cost factor là 10
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

/**
 * Compare a password with its hash
 * @param {string} password - The password to compare
 * @param {string} hash - The hash to compare against
 * @returns {Promise<boolean>} - True if the password matches the hash, otherwise False
 */
const comparePasswords = async (password, hash) => {
  try {
    const isMatch = await bcrypt.compare(password, hash); // So sánh mật khẩu với hash
    return isMatch;
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

module.exports = { hashPassword, comparePasswords };
