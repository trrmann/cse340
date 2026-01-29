// Needed resources
const express = require('express');
const router = new express.Router();
const utilities = require('../utilities/index');
const accountController = require('../controllers/accountController');
const errorController = require('../controllers/errorController');

// GET /account - provide authentication
router.get('/login', accountController.buildLogin);

// GET /account - show login page
router.get('/', accountController.buildLogin);

module.exports = router;
