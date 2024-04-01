const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = function(req, res, next) {
    // Kiểm tra xem header Authorization có tồn tại không
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Tách Bearer token từ header
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
        const token = parts[1];

        try {
            // Xác thực token và gán thông tin người dùng vào req.verifiedUser
            const verified = jwt.verify(token, config.jwtSecret);
            req.verifiedUser = verified; // Sử dụng req.verifiedUser thay vì req.user
            next();
        } catch (error) {
            console.error('Error authenticating user:', error.message);
            res.status(401).json({ message: 'Unauthorized' });
        }
    } else {
        return res.status(401).json({ message: 'Token format is incorrect' });
    }
};