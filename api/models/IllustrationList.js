// models/IllustrationList.js
const mongoose = require('mongoose');

const IllustrationListSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    collectedUsers: [{ type: String }], // 存储用户名的数组
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'IllustrationCategory',
        required: true
    }
});

module.exports = mongoose.model('IllustrationList', IllustrationListSchema);