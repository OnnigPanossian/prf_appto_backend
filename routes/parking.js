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
router.get('/:id/vehicles', parkingController.getVehiclesByParkingId);
router.post('/:id/vehicle/:idVehicle', parkingController.addVehicle);
router.delete('/:id/vehicle/:idVehicle', parkingController.deleteVehicle);

/**
 * Expose routes
 */
module.exports = router;
