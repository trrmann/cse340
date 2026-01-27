// Inventory Controller: Handles vehicle inventory display by classification and item detail.

const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');

const invCont = {};

// Renders all vehicles in a classification as a grid view.
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classification_id;
    const data =
      await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render('./inventory/classification', {
      title: className + ' vehicles',
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

// Renders individual vehicle detail view.
 * Displays comprehensive information about a specific vehicle including
 * full-size image, description, specifications, and pricing.
 *
 * @async
 * @function buildByInvId
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.inv_id - Inventory ID from route parameter
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function for error handling
 * @returns {Promise<void>} Renders item-detail.ejs view or forwards error
 * @throws {Error} Forwards any database or rendering errors to error middleware
 *
 * @description
 * Route: GET /inv/detail/:inv_id
 *
 * Process:
 * 1. Extracts inv_id from URL params
 * 2. Fetches vehicle details from database by ID
 * 3. Generates HTML detail view with image, specs, description
 * 4. Generates navigation menu
 * 5. Renders view with title showing vehicle make and model
 *
 * Features displayed:
 * - Full-size vehicle image
 * - Year, make, and model
 * - Formatted price (USD with commas)
 * - Detailed description
 * - Color specification
 * - Mileage (formatted with commas)
 *
 * @example
 * // URL: /inv/detail/5 (for specific vehicle)
 * // Results in detailed page for that vehicle
 */
invCont.buildByInvId = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id;
    const data = await invModel.getInventoryByInvId(inv_id);
    const grid = await utilities.buildItemDetailGrid(data);
    let nav = await utilities.getNav();
    const itemName = data[0].inv_make + ' ' + data[0].inv_model;
    res.render('./inventory/item-detail', {
      title: itemName,
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;
