const express = require('express');
const router = express.Router();
const marketController = require('../controllers/market.controller');

router.get('/prices/:gameId', marketController.getPrices);
router.post('/buy', marketController.buyIngredient);
router.put('/set-price', marketController.setPrice);

module.exports = router;

