/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const Vehicle = require('../models/vehicle');
const Rental = require('../models/rental');
const Parking = require('../models/parking');

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

      if (_req.query.length) {
        for (const key in _req.query) {
          vehicles.where(key, _req.query[key]);
        }
      }

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
      res.json({ message: 'Book OK' });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },

  returnVehicle: async (req, res) => {
    const _id = req.params.id;
    try {
      const vehicle = await Vehicle.findById(_id);

      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle Not Found' });
      }

      const parking = await Parking.findById(req.params.parking);

      if (!parking) {
        return res.status(400).json({ message: 'Parking Not Found' });
      }

      await Rental.updateOne({ vehicle, returnDate: null }, { returnDate: Date.now });
      vehicle.parking = parking;
      await vehicle.save();

      res.json({ message: 'Return OK' });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },
  calificateVehicule: async (req, res) => {
    const _id = req.params.id;
    const { rating } = req.body;
    try {
      const vehicle = await Vehicle.findById(_id);

      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle Not Found' });
      }
      if (rating || !Number.isNaN(rating)) {
        let finalRating;
        if (vehicle.timesRated > 0) {
          vehicle.timesRated += 1;
          finalRating = (vehicle.rating + rating) / vehicle.timesRated;
        } else {
          vehicle.timesRated = 1;
          finalRating = rating;
        }

        vehicle.rating = finalRating.toFixed(2);
        await vehicle.save();

        res.status(200).json({ message: 'OK' });
      } else {
        return res.status(400).json({ message: 'Must send a valid rating to set' });
      }
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },
};

module.exports = VehicleController;
