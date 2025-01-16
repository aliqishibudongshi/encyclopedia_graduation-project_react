const Game = require('../models/Game');
const IllustrationCategory = require('../models/IllustrationCategory');
const IllustrationList = require('../models/IllustrationList');

exports.getGamesWithDetails = async (req, res) => {
    try {
        const games = await Game.find().lean(); // Fetch all games
        const data = await Promise.all(
            games.map(async (game) => {
                const categories = await IllustrationCategory.find({ gameId: game._id }).lean();
                const categoriesWithIllustrations = await Promise.all(
                    categories.map(async (category) => {
                        const illustrations = await IllustrationList.find({ categoryId: category._id }).lean();
                        return { ...category, illustrations };
                    })
                );
                return { ...game, categories: categoriesWithIllustrations };
            })
        );
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch games with details' });
    }
};

exports.createGame = async (req, res) => {
    try {
        const newGame = new Game(req.body);
        await newGame.save();
        res.json(newGame);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create game' });
    }
};
