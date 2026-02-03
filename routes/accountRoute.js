// Needed resources
const express = require('express');
const router = new express.Router();
const utilities = require('../utilities/index');
const accountController = require('../controllers/accountController');
const errorController = require('../controllers/errorController');
const regValidate = require('../utilities/account-validation');

// GET /account - provide authentication
router.get('/login', utilities.handleErrors(accountController.buildLogin));
// GET /account - provide registration
router.get(
  '/registration',
  utilities.handleErrors(accountController.buildRegistration)
);
// POST /account - process registration
router.post(
  '/registration',
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// GET /account - show login page
router.get('/', accountController.buildLogin);

module.exports = router;
