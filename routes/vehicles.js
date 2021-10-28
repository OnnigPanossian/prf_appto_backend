const express = require('express');

const router = express.Router();
const vehicleController = require('../controllers/vehicles');

// CREATE VEHICLE
router.post('/', vehicleController.createVehicle);
// ALL VEHICLES
router.get('/', vehicleController.getVehicles);
// GET VEHICLE BY ID
router.get('/:id', vehicleController.getVehicle);
// UPDATE VEHICLE
router.put('/:id', vehicleController.updateVehicle);
// BOOK VEHICLE
router.post('/:id/book', vehicleController.bookVehicle);
module.exports = router;
