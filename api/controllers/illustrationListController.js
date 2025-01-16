const IllustrationList = require('../models/IllustrationList');

// Fetch all illustrations or filter by categoryId
exports.getAllIllustrationsList = async (req, res) => {
    try {
        const { categoryId } = req.query; // Extract categoryId from query parameters
        const filter = categoryId ? { categoryId } : {};
        const illustrationList = await IllustrationList.find(filter);
        res.json(illustrationList);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch illustrationList' });
    }
};

// Create a new illustration
exports.createIllustrationList = async (req, res) => {
    try {
        const newIllustrationList = new IllustrationList(req.body);
        await newIllustrationList.save();
        res.json(newIllustrationList);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create illustrationList' });
    }
};

// Update the collected status
exports.updateIllustrationList = async (req, res) => {
    try {
        const { id } = req.params;
        const { collected } = req.body;

        const updatedIllustration = await IllustrationList.findByIdAndUpdate(
            id,
            { collected },
            { new: true }
        );

        if (!updatedIllustration) {
            return res.status(404).json({ error: 'Illustration not found' });
        }

        res.json(updatedIllustration);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update illustrationList' });
    }
};
