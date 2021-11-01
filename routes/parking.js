/**
 * Dependencies
 */
const express = require('express');
const parkingController = require('../controllers/parking');

/**
 * Express instance
 */
const router = express.Router();

/**
 * Routes
 */
router.get('/:id', parkingController.getParking);
router.get('/', parkingController.getAll);
router.post('/', parkingController.createParking);

/**
 * Expose routes
 */
module.exports = router;
