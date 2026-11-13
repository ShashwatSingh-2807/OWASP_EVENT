const express = require('express');
const router = express.Router();
const shockController = require('../controllers/shock.controller');

router.post('/trigger', shockController.triggerShock);
router.post('/decide', shockController.decideShock);
router.get('/impact/:gameId', shockController.getShockImpact);

module.exports = router;

