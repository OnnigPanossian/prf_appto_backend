const express = require('express');

const router = express.Router();
const auth = require('../middlewares/auth');
const vehicleController = require('../controllers/vehicles');

// CREAR VEHICULO
router.post('/vehicles', vehicleController.createVehicle);
// ALL VEHICULES
router.get('/vehicles', vehicleController.getVehicles);
// GET VEHICLE BY ID
router.get('/vehicles/:id', auth, vehicleController.getVehicle);
// UPDATE VEHICLE
router.put('/vehicles/:id', vehicleController.updateVehicle);

module.exports = router;
