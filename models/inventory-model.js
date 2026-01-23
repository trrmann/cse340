/**
 * Inventory Model for CSE Motors Application
 * Database access layer for vehicle inventory and classification data
 * Uses PostgreSQL connection pool for efficient database queries
 * @module models/inventory-model
 */

const pool = require('../database/');

/**
 * Get all vehicle classifications from database
 * Retrieves complete list of vehicle categories (SUV, Truck, Sports, etc.)
 * ordered alphabetically by classification name.
 *
 * @async
 * @function getClassifications
 * @returns {Promise<Object>} PostgreSQL query result object
 * @returns {Array<Object>} result.rows - Array of classification objects
 * @returns {number} result.rows[].classification_id - Unique classification ID
 * @returns {string} result.rows[].classification_name - Classification name
 * @throws {Error} Database connection or query error
 *
 * @description
 * Used primarily for:
 * - Generating navigation menu
 * - Populating classification dropdowns
 * - Filtering inventory views
 *
 * @example
 * const data = await getClassifications();
 * // Returns: { rows: [{classification_id: 1, classification_name: 'SUV'}, ...] }
 */
async function getClassifications() {
  return await pool.query(
    'SELECT * FROM public.classification ORDER BY classification_name'
  );
}

/**
 * Get all vehicles in a specific classification
 * Performs a JOIN between inventory and classification tables to retrieve
 * all vehicle data along with classification name for display purposes.
 *
 * @async
 * @function getInventoryByClassificationId
 * @param {number} classification_id - The classification ID to filter by
 * @returns {Promise<Array<Object>>} Array of vehicle objects with classification data
 * @returns {number} return[].inv_id - Vehicle inventory ID
 * @returns {number} return[].inv_year - Vehicle year
 * @returns {string} return[].inv_make - Vehicle manufacturer
 * @returns {string} return[].inv_model - Vehicle model name
 * @returns {string} return[].inv_description - Detailed description
 * @returns {string} return[].inv_image - Path to full-size image
 * @returns {string} return[].inv_thumbnail - Path to thumbnail image
 * @returns {number} return[].inv_price - Vehicle price in USD
 * @returns {number} return[].inv_miles - Vehicle mileage
 * @returns {string} return[].inv_color - Vehicle color
 * @returns {number} return[].classification_id - Classification ID
 * @returns {string} return[].classification_name - Classification name (from JOIN)
 * @throws {Error} Logs error to console and returns undefined on failure
 *
 * @description
 * SQL Query:
 * - Joins inventory and classification tables
 * - Filters by classification_id
 * - Returns all matching vehicles
 *
 * @example
 * const suvs = await getInventoryByClassificationId(1);
 * // Returns array of all SUV vehicles
 */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error('getclassificationsbyid error ' + error);
  }
}

/**
 * Get detailed information for a single vehicle by inventory ID
 * Retrieves all data fields for one specific vehicle from the inventory table.
 *
 * @async
 * @function getInventoryByInvId
 * @param {number} inv_id - The unique inventory ID of the vehicle
 * @returns {Promise<Array<Object>>} Array with single vehicle object (or empty if not found)
 * @returns {number} return[0].inv_id - Vehicle inventory ID
 * @returns {number} return[0].inv_year - Vehicle year
 * @returns {string} return[0].inv_make - Vehicle manufacturer
 * @returns {string} return[0].inv_model - Vehicle model name
 * @returns {string} return[0].inv_description - Detailed description
 * @returns {string} return[0].inv_image - Path to full-size image
 * @returns {string} return[0].inv_thumbnail - Path to thumbnail image
 * @returns {number} return[0].inv_price - Vehicle price in USD
 * @returns {number} return[0].inv_miles - Vehicle mileage
 * @returns {string} return[0].inv_color - Vehicle color
 * @returns {number} return[0].classification_id - Classification ID
 * @throws {Error} Logs error to console and returns undefined on failure
 *
 * @description
 * Used for:
 * - Individual vehicle detail pages
 * - Displaying comprehensive vehicle information
 * - Editing vehicle records (future enhancement)
 *
 * @example
 * const vehicle = await getInventoryByInvId(5);
 * // Returns: [{inv_id: 5, inv_make: 'Jeep', inv_model: 'Wrangler', ...}]
 */
async function getInventoryByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      WHERE i.inv_id = $1`,
      [inv_id]
    );
    return data.rows;
  } catch (error) {
    console.error('getitemdetailbyid error ' + error);
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryByInvId,
};
