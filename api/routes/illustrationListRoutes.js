const express = require('express');
const { getAllIllustrationsList, updateIllustrationList } = require('../controllers/illustrationListController');
const router = express.Router();

// GET /api/list?categoryId=...
router.get('/', getAllIllustrationsList);

// PUT /api/list/:id
router.put('/:id', updateIllustrationList);

module.exports = router;
