// Inventory Controller: Handles vehicle inventory display by classification and item detail.

const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');

const invCont = {};

// Renders the management view for inventory (GET /inv/)
invCont.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classificationsSelect = await utilities.buildClassificationList();
    const classifications = await invModel.getClassifications();
    res.render('./inventory/management', {
      title: 'Inventory Management',
      nav,
      classifications: classifications && classifications.rows,
      classificationsSelect,
      message: req.flash('notice'),
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

// Handles POST to add a new classification
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body;
  let result;
  try {
    result = await invModel.insertClassification(classification_name);
  } catch (error) {
    result = { error: error.message || 'Database error.' };
  }
  if (result && !result.error) {
    req.flash('notice', 'Classification added successfully.');
    return res.redirect('/inv/');
  } else {
    // On error, re-render management view with error and sticky input
    const nav = await utilities.getNav();
    const classifications = await invModel.getClassifications();
    // Diagnostic log to surface real values passed to the view
    console.log('addClassification render:', {
      nav,
      classifications: classifications && classifications.rows,
      errors: [{ msg: result.error || 'Failed to add classification.' }],
      classification_name,
    });
    res.render('./inventory/management', {
      title: 'Inventory Management',
      nav,
      classifications: classifications.rows,
      message: null,
      errors: [{ msg: result.error || 'Failed to add classification.' }],
      classification_name,
    });
  }
};

// Handles POST to add a new inventory item with sticky form and error display
invCont.addInventory = async function (req, res, next) {
  try {
    const item = req.body;
    const result = await invModel.insertInventory(item);
    if (result && !result.error) {
      req.flash('notice', 'Inventory item added successfully.');
      return res.redirect('/inv/');
    } else {
      // On DB error, re-render management view with error and sticky input
      let nav = await utilities.getNav();
      const classifications = await invModel.getClassifications();
      res.render('./inventory/management', {
        layout: './layouts/layout',
        title: 'Inventory Management',
        nav,
        classifications: classifications.rows,
        message: null,
        errors: [{ msg: result.error || 'Failed to add inventory item.' }],
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData =
    await invModel.getInventoryByClassificationId(classification_id);
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error('No data returned'));
  }
};

// Handles POST to update an inventory item with sticky form and error display
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
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
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
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
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + ' ' + updateResult.inv_model;
    req.flash('notice', `The ${itemName} was successfully updated.`);
    res.redirect('/inv/');
  } else {
    const classificationSelect =
      await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash('notice', 'Sorry, the insert failed.');
    res.status(501).render('inventory/edit-inventory', {
      title: 'Edit ' + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

// Display the edit inventory item view
invCont.buildEditInventory = async (req, res, next) => {
  try {
    const inv_id = parseInt(req.params.inventory_id);
    let nav = await utilities.getNav();
    const itemData = (await invModel.getInventoryByInvId(inv_id))[0];
    const classificationList = await utilities.buildClassificationList(
      itemData.classification_id
    );
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    res.render('./inventory/edit-inventory', {
      title: 'Edit ' + itemName,
      nav,
      classificationList: classificationList,
      errors: null,
      message: null,
      inv_id: itemData.inv_id,
      inv_vin: itemData.inv_vin,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id,
    });
  } catch (error) {
    next(error);
  }
};

// Handles POST to edit an inventory item with sticky form and error display
invCont.editInventory = async function (req, res, next) {
  try {
    const inventory_id = parseInt(req.params.inventory_id, 10);
    const item = req.body;
    const result = await invModel.insertInventory(item);
    if (result && !result.error) {
      req.flash('notice', 'Inventory item edited successfully.');
      return res.redirect('/inv/');
    } else {
      // On DB error, re-render management view with error and sticky input
      let nav = await utilities.getNav();
      const classifications = await invModel.getClassifications();
      res.render('./inventory/management', {
        layout: './layouts/layout',
        title: 'Inventory Management',
        nav,
        classifications: classifications.rows,
        message: null,
        errors: [{ msg: result.error || 'Failed to edit inventory item.' }],
        ...item,
      });
    }
  } catch (error) {
    next(error);
  }
};
// NOT NEGOTIABLE MANDATORY REQUIREMENT: Build and deliver the delete confirmation view
invCont.buildDeleteInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id);
    const nav = await utilities.getNav();
    const itemData = (await invModel.getInventoryByInvId(inv_id))[0];
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    res.render('./inventory/delete-confirm', {
      title: 'Delete ' + itemName,
      nav,
      errors: null,
      message: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_price: itemData.inv_price,
    });
  } catch (error) {
    next(error);
  }
};

// NOT NEGOTIABLE MANDATORY REQUIREMENT: Carry out the delete process
invCont.deleteInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id);
    const result = await invModel.deleteInventory(inv_id);
    if (result && !result.error) {
      req.flash('notice', 'Inventory item deleted successfully.');
      return res.redirect('/inv/');
    } else {
      req.flash('notice', result.error || 'Failed to delete inventory item.');
      return res.redirect(`/inv/delete/${inv_id}`);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  invCont,
};
