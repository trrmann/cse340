// Needed resources
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');

// Route to build inventory by classification view
router.get('/type/:classification_id', invController.buildByClassificationId);

// Route to build inventory item detail view
router.get('/detail/:inv_id', invController.buildByInvId);

module.exports = router;
