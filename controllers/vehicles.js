/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const { ObjectId } = require('mongoose').Types;
const Vehicle = require('../models/vehicle');
const Rental = require('../models/rental');
const Parking = require('../models/parking');
const Category = require('../models/category');

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
    const _id = req.params.id;
    try {
      const vehicle = await Vehicle.findById(_id);

      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle Not Found' });
      }

      const parking = await Parking.findById(vehicle.parking._id);

      if (!parking) {
        return res.status(404).json({ message: 'Parking Not Found' });
      }

      if (!vehicle.parking) {
        return res.status(404).json({ message: 'Vehicle In Use' });
      }

      const rental = new Rental({
        vehicle,
        user: req.user._id,
        withdrawalDate: Date.now(),
        returnDate: null,
        parkingOrigin: vehicle.parking,
      });
      await rental.save();

      parking.vehicles = parking.vehicles.filter(
        (element) => _id !== new ObjectId(element).toString(),
      );
      await parking.save();

      vehicle.parking = null;
      await vehicle.save();

      res.json(rental);
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

      const parking = await Parking.findById(idParking);

      if (vehicle.parking) {
        return res.status(404).json({ message: 'Vehicle Already In A Parking' });
      }
      const rental = await Rental.findOne({ vehicle: _id, returnDate: null });

      const today = new Date(rental.withdrawalDate);
      const endDate = new Date();
      const minutes = parseInt((Math.abs(endDate.getTime() - today.getTime()) / (1000 * 60)) % 60, 10);

      if (!vehicle.category) {
        return res.status(404).json({ message: 'Vehicle without category, set a category to vehicle and try again' });
      }

      const category = await Category.findById(vehicle.category);

      if (!category) {
        return res.status(404).json({ message: 'No category found' });
      }

      if (vehicle.parking) {
        return res.status(404).json({ message: 'Vehicle Already In A Parking' });
      }

      const cost = category.costPerMinute;
      const price = minutes * Number(cost);

      rental.finalPrice = price;
      rental.returnDate = endDate;
      rental.parkingDestination = idParking;
      await rental.save();

      parking.vehicles.push(vehicle);
      await parking.save();
      vehicle.parking = idParking;
      await vehicle.save();

      res.json(rental);


    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },
  calificateVehicule: async (req, res) => {
    const _id = req.params.id;
    const { rating } = req.params;
    try {
      const vehicle = await Vehicle.findById(_id);

      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle Not Found' });
      }
      if (rating || !Number.isNaN(rating)) {
        let finalRating;
        if (vehicle.timesRated > 0) {
          vehicle.timesRated += 1;
          finalRating = (vehicle.rating + Number.parseFloat(rating)) / vehicle.timesRated;
        } else {
          vehicle.timesRated = 1;
          finalRating = rating;
        }

        vehicle.rating = Number.parseFloat(finalRating).toFixed(2);
        await vehicle.save();

        res.json();
      } else {
        return res.status(400).json({ message: 'Must send a valid rating to set' });
      }
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },
};

module.exports = VehicleController;
