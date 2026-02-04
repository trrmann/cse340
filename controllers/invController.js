// Inventory Controller: Handles vehicle inventory display by classification and item detail.

const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');

const invCont = {};

// Renders the management view for inventory (GET /inv/)
invCont.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classifications = await invModel.getClassifications();
    res.render('./inventory/management', {
      title: 'Inventory Management',
      nav,
      classifications: classifications.rows,
      message: req.flash('notice'),
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

// Handles POST to add a new classification
invCont.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body;
    const result = await invModel.insertClassification(classification_name);
    if (result && !result.error) {
      req.flash('notice', 'Classification added successfully.');
      return res.redirect('/inv/');
    } else {
      // On DB error, re-render form with error
      const nav = await utilities.getNav();
      res.render('./inventory/add-classification', {
        title: 'Add Classification',
        nav,
        message: result.error || 'Failed to add classification.',
        errors: [],
        classification_name,
      });
    }
  } catch (error) {
    next(error);
  }
};

// Handles POST to add a new inventory item
// Handles POST to add a new inventory item with sticky form and error display
invCont.addInventory = async function (req, res, next) {
  try {
    const item = req.body;
    const result = await invModel.insertInventory(item);
    if (result && !result.error) {
      req.flash('notice', 'Inventory item added successfully.');
      return res.redirect('/inv/');
    } else {
      // On DB error, re-render form with error
      let nav = await utilities.getNav();
      const classificationList = await utilities.buildClassificationList(
        item.classification_id
      );
      res.render('./inventory/add-inventory', {
        title: 'Add Inventory Item',
        nav,
        message: result.error || 'Failed to add inventory item.',
        errors: result.errors || [],
        classificationList,
        ...item,
      });
    }
  } catch (error) {
    next(error);
  }
};

// Renders all vehicles in a classification as a grid view.
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classification_id;
    const data =
      await invModel.getInventoryByClassificationId(classification_id);
    let nav = await utilities.getNav();
    let grid = await utilities.buildClassificationGrid(data);
    let title = '';
    let message = '';
    if (!data || data.length === 0) {
      title = 'No vehicles found';
      message = 'No vehicles found for this classification.';
    } else {
      title = data[0].classification_name + ' vehicles';
    }
    res.render('./inventory/classification', {
      title,
      nav,
      grid,
      message,
      errors: null,
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
    let nav = await utilities.getNav();
    let grid = await utilities.buildItemDetailGrid(data);
    let title = '';
    let message = '';
    if (!data || data.length === 0) {
      title = 'Vehicle not found';
      message = 'No details found for this vehicle.';
    } else {
      title = data[0].inv_make + ' ' + data[0].inv_model;
    }
    res.render('./inventory/item-detail', {
      title,
      nav,
      grid,
      message,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;
