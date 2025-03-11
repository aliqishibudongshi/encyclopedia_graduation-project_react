const express = require('express');
const { getCategory } = require('../controllers/illustrationCategoryController');
const router = express.Router();

router.get('/', getCategory);

module.exports = router
