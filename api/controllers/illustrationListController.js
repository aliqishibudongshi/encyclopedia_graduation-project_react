const IllustrationList = require('../models/IllustrationList');

// 获取所有插图或按 categoryId 过滤
exports.getAllIllustrationsList = async (req, res) => {
    try {
        const { categoryId } = req.query; // 从查询参数中提取 categoryId
        const filter = categoryId ? { categoryId } : {};
        const illustrationList = await IllustrationList.find(filter);
        res.json(illustrationList);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch illustrationList' });
    }
};

// 更新收集的状态
exports.updateIllustrationList = async (req, res) => {
    try {
        const { id } = req.params;
        const { collected, username } = req.body;

        const illustration = await IllustrationList.findById(id);

        if (collected) {
            if (!illustration.collectedUsers.includes(username)) {
                illustration.collectedUsers.push(username);
            }
        } else {
            illustration.collectedUsers = illustration.collectedUsers.filter(
                u => u !== username
            );
        }

        await illustration.save();
        res.json(illustration);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update illustrationList' });
        throw error;
    } 
};
