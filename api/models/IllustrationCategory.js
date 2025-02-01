// models/IllustrationCategory.js
const mongoose = require('mongoose');

const IllustrationCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    itemCount: {  // 新增字段
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('IllustrationCategory', IllustrationCategorySchema);