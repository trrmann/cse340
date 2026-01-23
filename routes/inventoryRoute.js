/**
 * Inventory Routes for CSE Motors Application
 * Defines URL routes for viewing vehicle classifications and individual vehicle details
 * @module routes/inventoryRoute
 */

// Needed resources
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');

/**
 * Route: Display all vehicles in a classification
 * URL Pattern: /inv/type/:classification_id
 * Method: GET
 *
 * @name GetVehiclesByClassification
 * @route {GET} /inv/type/:classification_id
 * @routeparam {number} :classification_id - The classification ID (e.g., 1 for SUVs)
 * @example
 * // URL: /inv/type/2
 * // Displays all vehicles in classification ID 2
 */
router.get('/type/:classification_id', invController.buildByClassificationId);

/**
 * Route: Display individual vehicle detail page
 * URL Pattern: /inv/detail/:inv_id
 * Method: GET
 *
 * @name GetVehicleDetail
 * @route {GET} /inv/detail/:inv_id
 * @routeparam {number} :inv_id - The vehicle inventory ID
 * @example
 * // URL: /inv/detail/5
 * // Displays detailed information for vehicle with ID 5
 */
router.get('/detail/:inv_id', invController.buildByInvId);

module.exports = router;
