const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    avatar: String,
    achievements: [String], // List of achievement IDs
});

module.exports = mongoose.model('User', UserSchema);
