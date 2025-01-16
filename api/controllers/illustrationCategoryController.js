const IllustrationCategory = require('../models/IllustrationCategory');
const Game = require('../models/Game');

exports.createCategory = async (req, res) => {
    try {
        const newCategory = new IllustrationCategory(req.body);
        await newCategory.save();
        res.json(newCategory);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create category' });
    }
};
exports.getCategory = async (req, res) => {
    try {
        const { gameId } = req.query;

        // For added security, to validate that the gameId in the request corresponds to a valid Game object before querying the database.
        if (gameId) {
            const gameExists = await Game.exists({ _id: gameId });
            if (!gameExists) {
                return res.status(400).json({ error: 'Invalid gameId' });
            }
        }

        const filter = gameId ? { gameId } : {};
        const categories = await IllustrationCategory.find(filter);
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch IllustrationCategory' });
    }
};