/* eslint-disable no-unused-expressions */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
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
  getVehicles: async (req, res) => {
    const { query } = req;
    try {
      const vehicles = await Vehicle.find();

      if (query) {
        Object.keys(query).forEach((key) => {
          vehicles.where(key).equal(query[key]);
        });
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
    const {
      params: { id: _id },
    } = req;

    try {
      const vehicle = await Vehicle.findById(_id);

      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle Not Found' });
      }

      if (!vehicle.parking) {
        return res.status(404).json({ message: 'Vehicle In Use' });
      }
      const rental = new Rental({
        vehicle,
        user: req.user._id,
        withdrawalDate: Date.now(),
        returnDate: null,
        parkingOriginId: vehicle.parking,
      });
      await rental.save();
      res.json({ message: rental });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },

  returnVehicle: async (req, res) => {
    const {
      params: { id: _id, idParking },
    } = req;

    try {
      const vehicle = await Vehicle.findById(_id);

      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle Not Found' });
      }

      if (vehicle.parking) {
        return res.status(404).json({ message: 'Vehicle Already In A Parking' });
      }
      const rental = await Rental.findOne({ vehicle: _id, returnDate: null });

      const today = new Date(rental.withdrawalData);
      const endDate = new Date();
      // eslint-disable-next-line max-len
      const minutes = parseInt((Math.abs(endDate.getTime() - today.getTime()) / (1000 * 60)) % 60, 10);

      const price = minutes * 100;

      rental.finalPrice = price;
      rental.parkingDestinationId = idParking;

      await rental.updateOne();
      res.json({ message: rental });
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
