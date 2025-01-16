const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// JWT Secret
const JWT_SECRET = 'encyclopedia_jwt_secret_key';

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ username: email });
        const isValidPassword = await bcrypt.compare(password, user.password);
        // 密码验证通过后，生成 token，否则401
        if (user && isValidPassword) {
            const token = jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
            const username = user.username;
            res.json({ token, username });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to login' });
    }
};

exports.registerUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username: email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ status: 'success', message: 'Registration success' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Registration failed', error });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ username: email });

    if (!user) return res.status(404).json({ message: 'Email not found' });

    res.status(201).json({ status: 'success', message: 'Reset link sent' });
};

exports.resetPassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ username: email });
        if (!user) return res.status(404).json({ message: 'Email not found' });

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(201).json({ status: 'success', message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to reset password', error });
    }
};

// 获取用户信息
exports.getUserInfo = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded._id);
        if (user) {
            res.json({
                username: user.username,
                // 可以返回其他用户信息，如用户ID、头像等，根据需求调整
            });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};