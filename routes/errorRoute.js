// Error routes: Endpoints for testing error handling middleware.

// Needed resources
const express = require('express');
const router = new express.Router();
const errorController = require('../controllers/errorController');

// GET /error/trigger-error - Triggers a 500 error for testing
router.get('/trigger-error', errorController.triggerError);

module.exports = router;
