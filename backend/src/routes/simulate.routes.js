const express = require('express');
const router = express.Router();
const simulateController = require('../controllers/simulate.controller');

router.post('/run', simulateController.runSimulation);
router.get('/preview/:gameId', simulateController.previewDemand);

module.exports = router;

