const Vehicle = require('../models/vehicle');
const Rental = require('../models/rental');

const VehicleController = {

  createVehicle: async (req, res) => {
    const vehicle = new Vehicle(req.body);
    if (!vehicle) {
      return res.status(400).json({ message: 'Error creating Vehicle' });
    }
    try {
      await vehicle.save();
      return res.status(201).json(vehicle);
    } catch (error) {
      return res.status(400).json({ message: error.message, error: error.errors });
    }
  },
  getVehicles: async (_req, res) => {
    try {
      const vehicles = await Vehicle.find();
      if (!vehicles.length) {
        return res.status(404).json({ message: 'Vehicles Not Found' });
      }
      return res.json(vehicles);
    } catch (error) {
      return res.status(400).json({ message: error.message, error: error.errors });
    }
  },
  getVehicle: async (req, res) => {
    const _id = req.params.id;

    try {
      const vehicle = await Vehicle.findById(_id);
      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle Not Found' });
      }
      return res.json(vehicle);
    } catch (error) {
      return res.status(400).json({ message: error.message, error: error.errors });
    }
  },
  updateVehicle: async (req, res) => {
    const _id = req.params.id;
    try {
      const vehicle = await Vehicle.updateOne({ _id }, req.body);
      res.json(vehicle);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  bookVehicle: async (req, res) => {
    const _id = req.params.id;
    try {
      const vehicle = await Vehicle.findById(_id);

      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle Not Found' });
      }

      const rental = new Rental({
        vehicle,
        user: req.user,
        withdrawalDate: Date.now(),
        returnDate: null,
      });
      await rental.save();

      vehicle.parking = null;
      await vehicle.save();
      res.json({ message: "Book OK" });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },
};

module.exports = VehicleController;
