const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    name: { type: String, required: true },
});

module.exports = mongoose.model('Game', GameSchema);