const mongoose = require('mongoose');

const IllustrationCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
});

module.exports = mongoose.model('IllustrationCategory', IllustrationCategorySchema);
