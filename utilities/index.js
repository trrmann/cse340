/**
 * Utility functions for CSE Motors application
 * Handles HTML generation for navigation, classification grids, and item details
 * @module utilities/index
 */

const invModel = require('../models/inventory-model');
const Util = {};

/**
 * Constructs the navigation HTML as an unordered list
 * Fetches all vehicle classifications from the database and generates
 * a responsive navigation menu with links to each classification page
 *
 * @async
 * @function getNav
 * @param {Object} req - Express request object (unused but required for middleware signature)
 * @param {Object} res - Express response object (unused but required for middleware signature)
 * @param {Function} next - Express next middleware function (unused but required for middleware signature)
 * @returns {Promise<string>} HTML string containing the complete navigation list
 * @throws {Error} If database query fails
 *
 * @example
 * const nav = await Util.getNav();
 * // Returns: '<ul><li><a href="/">Home</a></li>...'
 */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = '<ul>';
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += '<li>';
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      '</a>';
    list += '</li>';
  });
  list += '</ul>';
  return list;
};

/**
 * Builds the HTML grid for displaying vehicles in a classification
 * Creates a responsive card-based grid layout with vehicle images,
 * names, and prices. Each card is clickable and links to the detail page.
 *
 * @async
 * @function buildClassificationGrid
 * @param {Array<Object>} data - Array of vehicle objects from database
 * @param {number} data[].inv_id - Unique vehicle inventory ID
 * @param {string} data[].inv_year - Vehicle year
 * @param {string} data[].inv_make - Vehicle manufacturer
 * @param {string} data[].inv_model - Vehicle model name
 * @param {string} data[].inv_thumbnail - Path to vehicle thumbnail image
 * @param {number} data[].inv_price - Vehicle price in USD
 * @returns {Promise<string>} HTML string containing the vehicle grid or notice message
 *
 * @description
 * - Returns grid of vehicle cards if data exists
 * - Returns "no vehicles found" message if array is empty
 * - Prices are formatted with US locale (commas, dollar sign)
 * - Images include alt text for accessibility
 * - Cards use semantic HTML with ARIA labels
 *
 * @example
 * const vehicles = await invModel.getInventoryByClassificationId(1);
 * const grid = await Util.buildClassificationGrid(vehicles);
 */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += '<li class="vehicle-card">';
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" class="vehicle-card-link" title="View ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' details">';
      grid += '<div class="vehicle-image-wrapper">';
      grid +=
        '<img src="' +
        vehicle.inv_thumbnail +
        '" alt="' +
        vehicle.inv_year +
        ' ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        '" class="vehicle-image" />';
      grid += '</div>';
      grid += '<div class="vehicle-info">';
      grid += '<h2 class="vehicle-name">';
      grid += vehicle.inv_make + ' ' + vehicle.inv_model;
      grid += '</h2>';
      grid +=
        '<p class="vehicle-price"><span class="sr-only">Price: </span>$' +
        new Intl.NumberFormat('en-US').format(vehicle.inv_price) +
        '</p>';
      grid += '</div>';
      grid += '</a>';
      grid += '</li>';
    });
    grid += '</ul>';
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/**
 * Builds the HTML for displaying a single vehicle's detailed information
 * Creates a comprehensive detail view with full-size image, description,
 * specifications, and pricing in a responsive card layout.
 *
 * @async
 * @function buildItemDetailGrid
 * @param {Array<Object>} data - Array containing single vehicle object (uses first element)
 * @param {number} data[0].inv_id - Unique vehicle inventory ID
 * @param {number} data[0].inv_year - Vehicle year
 * @param {string} data[0].inv_make - Vehicle manufacturer
 * @param {string} data[0].inv_model - Vehicle model name
 * @param {string} data[0].inv_image - Path to full-size vehicle image
 * @param {number} data[0].inv_price - Vehicle price in USD
 * @param {string} data[0].inv_description - Detailed vehicle description
 * @param {string} data[0].inv_color - Vehicle color
 * @param {number} data[0].inv_miles - Vehicle mileage
 * @returns {Promise<string>} HTML string containing the vehicle detail view or notice message
 *
 * @description
 * - Uses full-size image (not thumbnail)
 * - Displays year, make, model prominently
 * - Formats price with US currency ($ and commas)
 * - Formats mileage with commas
 * - Shows color and mileage in specification grid
 * - Responsive: vertical on mobile, horizontal on tablet+
 * - ARIA labels for accessibility
 *
 * @example
 * const vehicle = await invModel.getInventoryByInvId(5);
 * const detailView = await Util.buildItemDetailGrid(vehicle);
 */
Util.buildItemDetailGrid = async function (data) {
  let grid;
  if (data && data.length > 0) {
    const vehicle = data[0];
    grid = '<div id="item-display" class="detail-container">';
    grid += '<div class="detail-image-section">';
    grid += '<div class="detail-image-wrapper">';
    grid +=
      '<img src="' +
      vehicle.inv_image +
      '" alt="' +
      vehicle.inv_year +
      ' ' +
      vehicle.inv_make +
      ' ' +
      vehicle.inv_model +
      '" class="detail-image" />';
    grid += '</div>';
    grid += '</div>';
    grid += '<div class="detail-info-section">';
    grid += '<div class="detail-header">';
    grid +=
      '<h2 class="detail-title">' +
      vehicle.inv_year +
      ' ' +
      vehicle.inv_make +
      ' ' +
      vehicle.inv_model +
      '</h2>';
    grid +=
      '<p class="detail-price"><span class="sr-only">Price: </span>$' +
      new Intl.NumberFormat('en-US').format(vehicle.inv_price) +
      '</p>';
    grid += '</div>';
    grid += '<div class="detail-description">';
    grid += '<p>' + vehicle.inv_description + '</p>';
    grid += '</div>';
    grid += '<dl class="detail-specs">';
    grid += '<div class="spec-item">';
    grid += '<dt class="spec-label">Color</dt>';
    grid += '<dd class="spec-value">' + vehicle.inv_color + '</dd>';
    grid += '</div>';
    grid += '<div class="spec-item">';
    grid += '<dt class="spec-label">Mileage</dt>';
    grid +=
      '<dd class="spec-value">' +
      new Intl.NumberFormat('en-US').format(vehicle.inv_miles) +
      ' miles</dd>';
    grid += '</div>';
    grid += '</dl>';
    grid += '</div>';
    grid += '</div>';
  } else {
    grid = '<p class="notice">Sorry, no matching vehicle could be found.</p>';
  }
  return grid;
};

/**
 * Express middleware wrapper for async error handling
 * Wraps async route handlers to automatically catch rejected promises
 * and pass errors to Express error handling middleware.
 *
 * @function handleErrors
 * @param {Function} fn - Async route handler function to wrap
 * @returns {Function} Express middleware function that handles promise rejection
 *
 * @description
 * This higher-order function eliminates the need for try-catch blocks
 * in every async route handler. It ensures all errors are properly
 * forwarded to the Express error handling middleware via next(error).
 *
 * Without this wrapper:
 * ```
 * router.get('/route', async (req, res, next) => {
 *   try {
 *     await someAsyncOperation();
 *   } catch (error) {
 *     next(error);
 *   }
 * });
 * ```
 *
 * With this wrapper:
 * ```
 * router.get('/route', Util.handleErrors(async (req, res, next) => {
 *   await someAsyncOperation();
 * }));
 * ```
 *
 * @example
 * const utilities = require('../utilities');
 * router.get('/inv/type/:id', utilities.handleErrors(invController.buildByClassificationId));
 */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
