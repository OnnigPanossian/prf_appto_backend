/**
 * Dependencies
 */
const express = require('express');
const parkingController = require('../models/parking')

/**
 * Express instance
 */
const router = express.Router();

/**
 * Routes
 */
router.get('/', parkingController.getAll)

/**
 * Expose routes
 */
module.exports = router;
