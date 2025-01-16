const express = require('express');
const { getAllIllustrationsList, createIllustrationList, updateIllustrationList } = require('../controllers/illustrationListController');
const router = express.Router();

// GET /api/list?categoryId=...
router.get('/', getAllIllustrationsList);

// POST /api/list
router.post('/', createIllustrationList);

// PUT /api/list/:id
router.put('/:id', updateIllustrationList);

module.exports = router;
