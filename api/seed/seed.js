const mongoose = require('mongoose');
const Game = require('../models/Game');
const IllustrationCategory = require('../models/IllustrationCategory');
const IllustrationList = require('../models/IllustrationList');

// 导入数据
const games = require('./data/games');
const { wuKongCategories, animalCrossingCategories } = require('./data/categories');
const { wuKongIllustrations, animalCrossingIllustrations } = require('./data/illustrations');

// 连接数据库
mongoose.connect('mongodb://localhost:27017/encyclopedia', { useNewUrlParser: true, useUnifiedTopology: true });

const seedData = async () => {
    try {
        // 清空现有数据
        await Game.deleteMany({});
        await IllustrationCategory.deleteMany({});
        await IllustrationList.deleteMany({});

        // 1. 插入游戏数据
        const gameDocs = await Game.insertMany(games);
        const wuKongGameId = gameDocs[0]._id;  // 黑神话悟空
        const animalCrossingGameId = gameDocs[1]._id;  // 动物森友会

        // 2. 为分类分配游戏ID
        wuKongCategories.forEach(c => c.gameId = wuKongGameId);
        animalCrossingCategories.forEach(c => c.gameId = animalCrossingGameId);

        // 3. 插入分类数据
        const wuKongCategoryDocs = await IllustrationCategory.insertMany(wuKongCategories);
        const animalCrossingCategoryDocs = await IllustrationCategory.insertMany(animalCrossingCategories);

        // 4. 由于中文分类名无法直接匹配英文键名，需手动定义映射关系
        // 定义黑神话悟空分类名称与插图键名的映射
        const wuKongCategoryMap = {
            '衣甲': 'armorIllustrations',
            '酒食': 'boozeIllustrations',
            '头冠': 'crownIllustrations',
            '珍玩': 'curioIllustrations',
            '臂甲': 'gardebrasIllustrations',
            '葫芦': 'gourdIllustrations',
            '种子': 'seedIllustrations',
            '精魄': 'spiritIllustrations',
            '腿甲': 'tassetIllustrations',
            '武器': 'weaponIllustrations'
        };

        // 定义动物森友会分类映射（根据实际键名调整）
        const animalCrossingCategoryMap = {
            '家具': 'furniture',
            '服装': 'clothing',
            '鱼类': 'fish',
            '昆虫': 'insects',
            '化石': 'fossil',
            '艺术品': 'artwork',
            'DIY图纸': 'diy',
            '唱片': 'record'
        };

        // 5. 分配分类ID到插图中
        const processGameData = async (gameIllustrations, categoryDocs, categoryMap) => {
            const allIllustrations = [];
            // 遍历每个分类（如衣甲、酒食）
            categoryDocs.forEach(category => {
                // 通过映射表获取对应的键名
                const categoryKey = categoryMap[category.name];
                if (categoryKey && gameIllustrations[categoryKey]) {
                    gameIllustrations[categoryKey].forEach(illustration => {
                        // 清理旧数据并添加分类ID
                        const cleanedIllustration = {
                            ...illustration, categoryId: category._id,
                            collectedUsers: []
                        };
                        delete cleanedIllustration.collected;
                        allIllustrations.push(cleanedIllustration);
                    });
                } else {
                    console.warn(`未找到分类 "${category.name}" 对应的插图键名`);
                }
            });
            console.log('待插入的插图数据:', allIllustrations);
            await IllustrationList.insertMany(allIllustrations);
        };

        // 处理黑神话数据时传入对应的映射表
        await processGameData(wuKongIllustrations, wuKongCategoryDocs, wuKongCategoryMap);
        // 处理动森数据时传入动森的映射表
        await processGameData(animalCrossingIllustrations, animalCrossingCategoryDocs, animalCrossingCategoryMap);

        // 6. 更新分类的itemCount
        const updateCategoryCounts = async (categories) => {
            for (const category of categories) {
                const count = await IllustrationList.countDocuments({ categoryId: category._id });
                await IllustrationCategory.findByIdAndUpdate(category._id, { itemCount: count });
            }
        };
        await updateCategoryCounts([...wuKongCategoryDocs, ...animalCrossingCategoryDocs]);

        console.log('✅ 数据播种成功！');
        process.exit();
    } catch (error) {
        console.error('❌ 播种失败:', error);
        process.exit(1);
    }
};

seedData();