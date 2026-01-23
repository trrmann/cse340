// Needed resources
const express = require('express');
const router = new express.Router();
const errorController = require('../controllers/errorController');

// Route to trigger intentional error for testing
router.get('/trigger-error', errorController.triggerError);

module.exports = router;
