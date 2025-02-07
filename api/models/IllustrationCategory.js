// models/IllustrationCategory.js
const mongoose = require('mongoose');

const IllustrationCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    // 反映每个图鉴分类下的实际图鉴项数量
    itemCount: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('IllustrationCategory', IllustrationCategorySchema);