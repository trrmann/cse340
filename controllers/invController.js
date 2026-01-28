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
