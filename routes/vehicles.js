const express = require('express');

const router = express.Router();
const vehicleController = require('../controllers/vehicles');
const auth = require('../middlewares/auth');

// CREATE VEHICLE
router.post('/', vehicleController.createVehicle);
// ALL VEHICLES
router.get('/', vehicleController.getVehicles);
// GET VEHICLE BY ID
router.get('/:id', vehicleController.getVehicle);
// UPDATE VEHICLE
router.put('/:id', vehicleController.updateVehicle);
// BOOK VEHICLE
router.post('/:id/book', auth, vehicleController.bookVehicle);
// RETURN VEHICLE
router.post('/:id/return/:idParking', vehicleController.returnVehicle);
// CALIFICATION VEHICLE
router.put('/:id/calificate/:rating', vehicleController.calificateVehicule);

module.exports = router;
