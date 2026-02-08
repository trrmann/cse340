// Inventory Model: Handles database queries for vehicle inventory and classifications.

const pool = require('../database/');

// Returns all vehicle classifications, ordered alphabetically.
async function getClassifications() {
  return await pool.query(
    'SELECT * FROM public.classification ORDER BY classification_name'
  );
}

// Returns all vehicles for a given classification, including classification name.
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
    return {
      error: 'Failed to retrieve inventory by classification. ' + error.message,
    };
  }
}

// Returns detailed info for a single vehicle by inventory ID.
async function getInventoryByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      WHERE i.inv_id = $1`,
      [inv_id]
    );
    return data.rows;
  } catch (error) {
    return { error: 'Failed to retrieve inventory item. ' + error.message };
  }
}

// Insert a new classification (letters/numbers only)
async function insertClassification(classification_name) {
  try {
    const sql =
      'INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *';
    const result = await pool.query(sql, [classification_name]);
    return result.rows[0];
  } catch (error) {
    return { error: 'Failed to insert classification. ' + error.message };
  }
}

// Insert a new inventory item
async function insertInventory(item) {
  try {
    const sql = `INSERT INTO public.inventory
      (inv_vin, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`;
    const values = [
      item.inv_vin,
      item.inv_make,
      item.inv_model,
      item.inv_year,
      item.inv_description,
      item.inv_image || 'No Image Available',
      item.inv_thumbnail || 'No Image Available',
      item.inv_price ?? 0,
      item.inv_miles ?? null,
      item.inv_color ?? null,
      item.classification_id,
    ];
    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (error) {
    return { error: 'Failed to insert inventory item. ' + error.message };
  }
}

// update an inventory item
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      'UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *';
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error('model error: ' + error);
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryByInvId,
  insertClassification,
  insertInventory,
  updateInventory,
};
