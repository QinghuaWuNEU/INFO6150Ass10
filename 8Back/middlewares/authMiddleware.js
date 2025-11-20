// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // 用于查找用户

const authMiddleware = async (req, res, next) => {
    let token;

    // 1. 检查 Header 中是否有 Token
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // 从 Header 中获取 Token (例如: 'Bearer tokenValue')
            token = req.headers.authorization.split(' ')[1];

            // 2. 验证 Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. 查找用户并附加到请求对象 (req) 上
            // 使用 .select('-password') 排除密码
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return res.status(401).json({ error: 'Not authorized, user not found.' });
            }

            // ⚠️ 关键：将用户信息（包含 type）附加到请求上
            req.user = user; 
            
            // 检查管理员权限 (如果需要，可以在这里提前阻止非管理员访问，但更灵活的做法是在 Controller 里检查)
            if (req.originalUrl === '/user/users' && user.type !== 'admin') {
                 // 示例：如果访问 /user/users 但不是管理员
                 // 也可以在 controller 中处理这个检查
            }

            next();
        } catch (error) {
            console.error(error);
            // Token 验证失败（过期或无效签名）
            res.status(401).json({ error: 'Not authorized, token failed or expired.' });
        }
    }

    // 4. 如果没有 Token
    if (!token) {
        res.status(401).json({ error: 'Not authorized, no token.' });
    }
};

module.exports = authMiddleware;