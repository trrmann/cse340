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

// Middleware to check validation results
validate.checkValidation = (redirectPath) => (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash(
      'notice',
      errors
        .array()
        .map((e) => e.msg)
        .join(' ')
    );
    return res.redirect(redirectPath);
  }
  next();
};

module.exports = validate;
