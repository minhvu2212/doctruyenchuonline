const jwt = require('jsonwebtoken');
const config = require('../config');

const authenticateUser = (req, res, next) => {
    // Lấy token từ header Authorization
    const authHeader = req.headers.authorization;
    
    // Kiểm tra xem authHeader có tồn tại và bắt đầu bằng "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Token is missing or not in the correct format');
        // Nếu không có token hoặc token không đúng định dạng, trả về lỗi 401 Unauthorized
        return res.status(401).json({ message: 'Unauthorized: Token missing or not in the correct format' });
    }

    // Tách token từ chuỗi "Bearer <token>"
    const token = authHeader.split(' ')[1];

    try {
        console.log('Verifying token');
        // Xác thực token bằng secret key từ config
        const decoded = jwt.verify(token, config.jwtSecret);
        // Lưu thông tin người dùng vào req.user để sử dụng trong các middleware tiếp theo
        req.user = decoded;
        console.log('User authenticated:', decoded);
        // Gọi next() để tiếp tục xử lý yêu cầu
        next();
    } catch (error) {
        console.error('Error authenticating user:', error.message);
        // Nếu có lỗi khi xác thực token, trả về lỗi 401 Unauthorized
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

module.exports = authenticateUser;