const express = require('express');
const router = express.Router();
const { saveProgress, getAllProgress } = require('../controllers/progressController');

// Routes
router.post('/save', saveProgress);
router.get('/', getAllProgress);

module.exports = router;
