const express = require('express');
const router = express.Router();
const { loginUser, registerUser, forgotPassword, resetPassword, getUserInfo } = require('../controllers/userController');

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get("/me", getUserInfo);

module.exports = router;