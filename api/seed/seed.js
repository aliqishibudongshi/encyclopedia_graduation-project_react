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

        const wuKongCategoryDocs = await IllustrationCategory.insertMany(wuKongCategories);
        const animalCategoryDocs = await IllustrationCategory.insertMany(animalCategories);

        // Assign category IDs to illustrations
        const categories = [...wuKongCategoryDocs, ...animalCategoryDocs];
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

        illustrationGroups.forEach((group, index) => {
            group.forEach((illustration) => {
                illustration.categoryId = categories[index % categories.length]._id;
            });
        });

        await IllustrationList.insertMany(illustrationGroups.flat());

        console.log('Seed data added successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
