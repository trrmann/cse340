const { body, validationResult } = require('express-validator');
const validate = {};

// Validation rules for adding a classification
validate.classificationRules = () => [
  body('classification_name')
    .trim()
    .notEmpty()
    .withMessage('Classification name is required.')
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage(
      'Classification name must be alphanumeric with no spaces or special characters.'
    ),
];

// Validation rules for adding an inventory item
validate.inventoryRules = () => [
  body('inv_vin').trim().notEmpty().withMessage('VIN is required.'),
  body('inv_make').trim().notEmpty().withMessage('Make is required.'),
  body('inv_model').trim().notEmpty().withMessage('Model is required.'),
  body('inv_year')
    .trim()
    .notEmpty()
    .isLength({ min: 4, max: 4 })
    .withMessage('Year must be 4 digits.'),
  body('inv_description')
    .trim()
    .notEmpty()
    .withMessage('Description is required.'),
  body('classification_id')
    .notEmpty()
    .isInt()
    .withMessage('Classification is required.'),
];

// Middleware to check validation results for add-inventory
validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await require('../utilities').getNav();
    const classifications =
      await require('../models/inventory-model').getClassifications();
    req.flash(
      'notice',
      errors
        .array()
        .map((e) => e.msg)
        .join(' ')
    );
    return res.render('./inventory/management', {
      layout: './layouts/layout',
      title: 'Inventory Management',
      nav,
      classifications: classifications.rows,
      message: req.flash('notice'),
      errors: errors.array(),
      ...req.body,
    });
  }
  next();
};

// Middleware to check validation results for editing inventory items (errors go to edit view)
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await require('../utilities').getNav();
    const classifications =
      await require('../models/inventory-model').getClassifications();
    req.flash(
      'notice',
      errors
        .array()
        .map((e) => e.msg)
        .join(' ')
    );
    // Build the same title as the controller
    const title =
      'Edit ' + (req.body.inv_make || '') + ' ' + (req.body.inv_model || '');
    return res.render('./inventory/edit-inventory', {
      layout: './layouts/layout',
      title,
      nav,
      classifications: classifications.rows,
      message: req.flash('notice'),
      errors: errors.array(),
      inv_id: req.body.inv_id || '',
      inv_make: req.body.inv_make || '',
      inv_model: req.body.inv_model || '',
      inv_year: req.body.inv_year || '',
      inv_description: req.body.inv_description || '',
      inv_image: req.body.inv_image || '',
      inv_thumbnail: req.body.inv_thumbnail || '',
      inv_price: req.body.inv_price || '',
      inv_miles: req.body.inv_miles || '',
      inv_color: req.body.inv_color || '',
      classification_id: req.body.classification_id || '',
      classificationList: await require('../utilities').buildClassificationList(
        req.body.classification_id
      ),
    });
  }
  next();
};

// Middleware to check validation results for add-classification
validate.checkClassificationValidation = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await require('../utilities').getNav();
    const classifications =
      await require('../models/inventory-model').getClassifications();
    req.flash(
      'notice',
      errors
        .array()
        .map((e) => e.msg)
        .join(' ')
    );
    return res.render('./inventory/management', {
      layout: './layouts/layout',
      title: 'Inventory Management',
      nav,
      classifications: classifications.rows,
      message: req.flash('notice'),
      errors: errors.array(),
      classification_name: req.body.classification_name || '',
      ...req.body,
    });
  }
  next();
};

// Middleware to check validation results for add-classification
validate.checkClassificationValidation = async (req, res, next) => {
  console.log('checkClassificationValidation called');
  console.log('Body:', req.body);
  console.log('Validation errors:', req.errors);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await require('../utilities').getNav();
    const classifications =
      await require('../models/inventory-model').getClassifications();
    req.flash(
      'notice',
      errors
        .array()
        .map((e) => e.msg)
        .join(' ')
    );
    return res.render('./inventory/management', {
      layout: './layouts/layout',
      title: 'Inventory Management',
      nav,
      classifications: classifications.rows,
      message: req.flash('notice'),
      errors: errors.array(),
      classification_name: req.body.classification_name || '',
      ...req.body,
    });
  }
  next();
};

// Middleware to check validation results for update-inventory
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await require('../utilities').getNav();
    const classifications =
      await require('../models/inventory-model').getClassifications();
    // Build the same title as the controller
    const title =
      'Edit ' + (req.body.inv_make || '') + ' ' + (req.body.inv_model || '');
    req.flash(
      'notice',
      errors
        .array()
        .map((e) => e.msg)
        .join(' ')
    );
    return res.render('./inventory/edit-inventory', {
      layout: './layouts/layout',
      title,
      nav,
      classifications: classifications.rows,
      message: req.flash('notice'),
      errors: errors.array(),
      inv_id: req.body.inv_id || '',
      ...req.body,
    });
  }
  next();
};

module.exports = validate;
