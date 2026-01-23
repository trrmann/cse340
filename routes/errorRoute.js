/**
 * Error Routes for CSE Motors Application
 * Provides testing endpoint for validating error handling middleware
 * @module routes/errorRoute
 */

// Needed resources
const express = require('express');
const router = new express.Router();
const errorController = require('../controllers/errorController');

/**
 * Route: Trigger intentional 500 error for testing
 * URL Pattern: /error/trigger-error
 * Method: GET
 *
 * @name TriggerTestError
 * @route {GET} /error/trigger-error
 * @description
 * This route intentionally generates a 500 Internal Server Error
 * to test and validate error handling middleware functionality.
 * Displays a crash test dummy themed error page.
 *
 * Used for:
 * - Testing error handling middleware
 * - Demonstrating custom error pages
 * - Validating error logging
 * - Development and debugging
 *
 * @example
 * // Access in browser:
 * // http://localhost:5500/error/trigger-error
 * // Displays 500 error page with crash test dummy theme
 */
router.get('/trigger-error', errorController.triggerError);

module.exports = router;
