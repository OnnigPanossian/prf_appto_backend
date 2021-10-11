const express = require('express');

const router = express.Router();
const auth = require('../middlewares/auth');
const vehicleController = require('../controllers/vehicles');

// CREAR VEHICULO
router.post('/', vehicleController.createVehicle);
// ALL VEHICULES
router.get('/', vehicleController.getVehicles);
// GET VEHICLE BY ID
router.get('/:id', auth, vehicleController.getVehicle);
// UPDATE VEHICLE
router.put('/:id', vehicleController.updateVehicle);

module.exports = router;
