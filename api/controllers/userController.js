const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// 登录用户
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username: username.trim() })
            .select('+password')
            .lean();

        if (!user) {
            return res.status(401).json({ error: '用户不存在' });
        }

        const isValid = await bcrypt.compare(password.trim(), user.password);

        if (!isValid) {
            return res.status(401).json({ error: '密码错误' });
        }

        // 设置 session，并在保存完成后发送响应
        req.session.userId = user._id;
        req.session.save((err) => {
            if (err) {
                console.log("Session 保存失败：", err);
                return res.status(500).json({ error: "会话初始化失败" });
            }

            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({
                token,
                username: user.username,
                userId: user._id,
                platforms: user.platforms
            });
        });
    } catch (error) {
        res.status(500).json({ error: '服务器异常，请稍后重试' });
    }
};


// 注册用户
exports.registerUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. 显式检查用户名存在性
        const existingUser = await User.findOne({ username: username.trim() });
        if (existingUser) {
            return res.status(409).json({
                status: 'error',
                code: 'USERNAME_EXISTS',
                message: '用户名已被使用'
            });
        }

        // 2. 创建新用户
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username: username.trim(), password: hashedPassword });
        await newUser.save();

        res.status(201).json({
            status: 'success',
            message: '注册成功'
        });
    } catch (error) {
        let response = {
            status: 'error',
            code: 'SERVER_ERROR',
            message: '注册失败'
        };

        if (error.code === 11000) {
            response = {
                ...response,
                code: 'USERNAME_EXISTS',
                message: '用户名已被占用'
            };
        } else if (error.name === 'ValidationError') {
            response = {
                ...response,
                code: 'VALIDATION_FAILED',
                message: Object.values(error.errors).map(e => e.message).join('; ')
            };
        }

        console.error('Registration Error:', error);
        res.status(500).json(response);
    }
};

// 忘记密码
exports.forgotPassword = async (req, res) => {
    const { username } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ message: 'username not found' });

    res.status(201).json({ status: 'success', message: 'Reset link sent' });
};

// 重置密码
exports.resetPassword = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ status: 'username error', message: 'username not found' });

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(201).json({ status: 'success', message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to reset password', error });
    }
};

// 检查用户名
exports.checkUsername = async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) return res.status(400).json({ message: '缺少用户名参数' });

        const user = await User.findOne({ username });
        res.json({
            available: !user
        });
    } catch (error) {
        res.status(500).json({ message: '检查服务错误' });
    }
};