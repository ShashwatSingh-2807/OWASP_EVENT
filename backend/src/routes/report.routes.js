const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');

router.get('/daily/:gameId/:day', reportController.getDailyReport);
router.get('/summary/:gameId', reportController.getSummary);

module.exports = router;

