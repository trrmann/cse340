/**
 * Error Controller for CSE Motors Application
 * Handles intentional error generation for testing error handling middleware
 * @module controllers/errorController
 */

const errorController = {};

/**
 * Intentionally trigger a 500 Internal Server Error
 * Used for testing and validating error handling middleware functionality.
 * Generates a crash test dummy themed error page.
 *
 * @async
 * @function triggerError
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>} Passes error to error handling middleware
 * @throws {Error} Always throws a 500 error with custom status property
 *
 * @description
 * This controller is specifically designed for testing purposes:
 * - Creates an Error object with descriptive message
 * - Sets error.status = 500 for proper HTTP status code
 * - Forwards error to Express error middleware via next(error)
 * - Results in crash test dummy themed error page display
 *
 * Route: GET /error/trigger-error
 *
 * @example
 * // Access via browser or curl:
 * // http://localhost:5500/error/trigger-error
 * router.get('/trigger-error', errorController.triggerError);
 */
errorController.triggerError = async function (req, res, next) {
  try {
    // Intentionally trigger a 500 error
    const error = new Error(
      'Intentional 500 error triggered for testing purposes.'
    );
    error.status = 500;
    throw error;
  } catch (error) {
    next(error);
  }
};

module.exports = errorController;
