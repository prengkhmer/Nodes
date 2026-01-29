const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/dashboardController');

// Dashboard route
router.get('/dashboard', getDashboardData);

module.exports = router;