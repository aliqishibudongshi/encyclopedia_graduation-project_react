const express = require('express');
const { getGamesWithDetails } = require('../controllers/gameController');
const router = express.Router();

router.get('/', getGamesWithDetails);

module.exports = router;
