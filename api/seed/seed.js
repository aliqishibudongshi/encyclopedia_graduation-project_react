const mongoose = require('mongoose');
const Game = require('../models/Game');
const IllustrationCategory = require('../models/IllustrationCategory');
const IllustrationList = require('../models/IllustrationList');

// Import data
const games = require('./data/games');
const { wuKongCategories, animalCategories } = require('./data/categories');
const { armorIllustrations, boozeIllustrations, crownIllustrations, curioIllustrations, gardebrasIllustrations, gourdIllustrations, seedIllustrations, spiritIllustrations, tassetIllustrations, weaponIllustrations } = require('./data/illustrations');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/encyclopedia', { useNewUrlParser: true, useUnifiedTopology: true });

const seedData = async () => {
    try {
        // Clear existing data
        await Game.deleteMany({});
        await IllustrationCategory.deleteMany({});
        await IllustrationList.deleteMany({});

        // Add games
        const gameDocs = await Game.insertMany(games);

        // Assign game IDs to categories
        wuKongCategories.forEach((category) => (category.gameId = gameDocs[0]._id));
        animalCategories.forEach((category) => (category.gameId = gameDocs[1]._id));

        // 插入分类
        const wuKongCategoryDocs = await IllustrationCategory.insertMany(wuKongCategories);
        const animalCategoryDocs = await IllustrationCategory.insertMany(animalCategories);
        const categories = [...wuKongCategoryDocs, ...animalCategoryDocs];

        // Assign category IDs to illustrations
        const illustrationGroups = [
            armorIllustrations,
            boozeIllustrations,
            crownIllustrations,
            curioIllustrations,
            gardebrasIllustrations,
            gourdIllustrations,
            seedIllustrations,
            spiritIllustrations,
            tassetIllustrations,
            weaponIllustrations,
        ];

        // 按分类顺序分配插图
        illustrationGroups.forEach((group, index) => {
            const targetCategory = categories[index % categories.length];
            group.forEach(illustration => {
                delete illustration.collected;
                illustration.collectedUsers = [];
                illustration.categoryId = targetCategory._id;
            });
        });

        // 插入所有插图数据
        await IllustrationList.insertMany(illustrationGroups.flat());

        // 更新分类的itemCount（必须在插入插图之后）
        for (const category of categories) {
            const count = await IllustrationList.countDocuments({
                categoryId: category._id
            });
            await IllustrationCategory.findByIdAndUpdate(category._id, {
                itemCount: count
            });
        }

        console.log('Seed data added successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
