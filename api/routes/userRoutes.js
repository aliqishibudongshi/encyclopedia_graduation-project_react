const express = require('express');
const router = express.Router();
const { loginUser, registerUser, forgotPassword, resetPassword, checkUsername, getUserInfo } = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/check', checkUsername);
router.get('/me', authenticateToken, getUserInfo);
module.exports = router;