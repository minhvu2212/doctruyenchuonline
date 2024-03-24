
const jwt = require('jsonwebtoken');

const config = require('../config');

const adminMiddleware = (req, res, next) => {
    // Kiểm tra xem req.user đã được xác định chưa và người dùng có phải là quản trị viên không
    if (!req.user || !req.user.isAdmin) {
        console.log('Access denied. User token:', req.user, 'is not an admin.');
        return res.status(403).json({ message: 'Access denied: Admin privileges required' });
    }
    
    // Nếu người dùng là quản trị viên, ghi vào console và tiếp tục với các xử lý tiếp theo
    console.log('Admin access granted. User token:', req.user, 'is an admin.');
    next();
};

module.exports = adminMiddleware;