// Inventory routes: Handles vehicle classification and detail page endpoints.

// Needed resources
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');
const invValidation = require('../utilities/inventory-validation');
const utilities = require('../utilities/index');

// Management view (GET /inv/)
router.get('/', invController.invCont.buildManagement);

// Add classification (POST /inv/add-classification)
router.post(
  '/add-classification',
  invValidation.classificationRules(),
  invValidation.checkClassificationValidation,
  invController.invCont.addClassification
);

// Add inventory item (POST /inv/add-inventory)
router.post(
  '/add-inventory',
  invValidation.inventoryRules(),
  invValidation.checkInventoryData,
  invController.invCont.addInventory
);

// GET /inv/type/:classification_id - Show all vehicles in a classification
router.get(
  '/type/:classification_id',
  invController.invCont.buildByClassificationId
);

// GET /inv/detail/:inv_id - Show details for a single vehicle
router.get('/detail/:inv_id', invController.invCont.buildByInvId);

// GET /inv/getInventory/:classification_id - Show details for a single vehicle
router.get(
  '/getInventory/:classification_id',
  utilities.handleErrors(invController.invCont.getInventoryJSON)
);

// Route to display the edit inventory item view
router.get(
  '/edit/:inventory_id',
  utilities.handleErrors(invController.invCont.buildEditInventory)
);

// Route to process the edit inventory item form submission
router.post(
  '/update',
  invValidation.inventoryRules(),
  invValidation.checkUpdateData,
  utilities.handleErrors(invController.invCont.updateInventory)
);
// NOT NEGOTIABLE MANDATORY REQUIREMENT: Delete Inventory GET route (confirmation step)
router.get(
  '/delete/:inv_id',
  utilities.handleErrors(invController.invCont.buildDeleteInventory)
);

// NOT NEGOTIABLE MANDATORY REQUIREMENT: Delete Inventory POST route (actual delete)
router.post(
  '/delete',
  utilities.handleErrors(invController.invCont.deleteInventory)
);

module.exports = router;
