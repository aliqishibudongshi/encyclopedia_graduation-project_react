const mongoose = require('mongoose');
const IllustrationList = require('./models/IllustrationList');

mongoose.connect('mongodb://localhost:27017/encyclopedia', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to MongoDB');

        try {
            const illustrations = await IllustrationList.find();
            if (!illustrations.length) {
                console.log('No illustrations found to update.');
                process.exit();
            }

            for (let illustration of illustrations) {
                console.log('Processing illustration:', illustration.name);
                const relativePath = illustration.image.includes('seed\\data\\images\\')
                    ? illustration.image.split('seed\\data\\images\\')[1]
                    : null;

                if (relativePath) {
                    illustration.image = `/images/${relativePath.replace(/\\/g, '/')}`;
                    const savedIllustration = await illustration.save();
                    console.log('Updated image path:', illustration.image);
                }

            }


            console.log('Image paths updated successfully!');
            process.exit();
        } catch (error) {
            console.error('Error updating image paths:', error);
            process.exit(1);
        }
    })
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });
