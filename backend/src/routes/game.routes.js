const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game.controller');

router.post('/start', gameController.startGame);
router.get('/state/:gameId', gameController.getGameState);

module.exports = router;

