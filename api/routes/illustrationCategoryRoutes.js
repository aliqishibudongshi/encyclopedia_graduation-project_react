const express = require('express');
const { createCategory, getCategory } = require('../controllers/illustrationCategoryController');
const router = express.Router();

router.get('/', getCategory);
router.post('/', createCategory);

module.exports = router
