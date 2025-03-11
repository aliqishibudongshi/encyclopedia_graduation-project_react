const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // 支持从Cookie获取token
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            error: '未提供访问令牌',
            solution: '请先登录系统'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.userId };
        next();
    } catch (error) {
        res.status(401).json({
            error: '无效的访问令牌',
            action: '请清除缓存后重新登录'
        });
    }
};

module.exports = authenticateToken;
