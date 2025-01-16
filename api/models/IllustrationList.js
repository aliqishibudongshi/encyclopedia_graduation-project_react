const mongoose = require('mongoose');

const IllustrationListSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String }, // URL to the image
    collected: { type: Boolean, default: false },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'IllustrationCategory', required: true },
});

module.exports = mongoose.model('IllustrationList', IllustrationListSchema);
