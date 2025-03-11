const IllustrationCategory = require('../models/IllustrationCategory');
const Game = require('../models/Game');

exports.getCategory = async (req, res) => {
    try {
        const { gameId } = req.query;

        // 为了增加安全性，在查询数据库之前验证请求中的 gameId 是否对应有效的 Game 对象。
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