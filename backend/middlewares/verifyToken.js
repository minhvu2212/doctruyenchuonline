const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = function(req, res, next) {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }
    try {
        const verified = jwt.verify(token, config.jwtSecret);
        req.verifiedUser = verified;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
};
