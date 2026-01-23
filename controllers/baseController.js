/**
 * Base Controller for CSE Motors Application
 * Handles the main home page rendering and base site functionality
 * @module controllers/baseController
 */

const utilities = require('../utilities/');
const baseController = {};

/**
 * Build and render the home page
 * Fetches navigation data and renders the home view with DeLorean hero section,
 * upgrade cards, and customer reviews.
 *
 * @async
 * @function buildHome
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Renders the index.ejs view
 *
 * @description
 * This is the main landing page controller that:
 * - Generates the navigation menu from database classifications
 * - Renders the home page with title and navigation
 * - Displays featured vehicle (DeLorean) with overlay
 * - Shows upgrade products grid
 * - Lists customer reviews
 *
 * @example
 * router.get('/', baseController.buildHome);
 */
baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();
  res.render('index', { title: 'Home', nav });
};

module.exports = baseController;
