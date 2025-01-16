const mongoose = require('mongoose');

const CommunitySchema = new mongoose.Schema({
    username: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    likes: [
        {
            username: String, // 点赞用户的ID
            likedAt: { type: Date, default: Date.now } // 点赞时间
        }
    ],
    comments: [
        {
            username: String,
            comment: String,
            createdAt: { type: Date, default: Date.now },
        },
    ],
    imagePath: [String] // 存储图片路径为数组
});

module.exports = mongoose.model('Community', CommunitySchema);
