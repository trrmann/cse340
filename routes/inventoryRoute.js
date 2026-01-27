// Inventory routes: Handles vehicle classification and detail page endpoints.

// Needed resources
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');

// GET /inv/type/:classification_id - Show all vehicles in a classification
router.get('/type/:classification_id', invController.buildByClassificationId);

// GET /inv/detail/:inv_id - Show details for a single vehicle
router.get('/detail/:inv_id', invController.buildByInvId);

module.exports = router;
