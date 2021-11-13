const { response } = require('express');
const User = require('../models/user');
const Rental = require('../models/rental');

const userController = {
  createUser: async (req, res) => {
    const user = new User(req.body);
    if (!user) {
      return res.status(400).json({ message: 'Error creating User' });
    }
    try {
      await user.generateToken();
      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({ message: error.message, error: error.errors });
    }
  },
  updateUser: async (req, res) => {
    const { _id } = req.user;
    const o = Object.keys(req.body)
      .filter((k) => req.body[k] !== null && req.body[k] !== '' && req.body[k] !== undefined)
      .reduce((a, k) => ({ ...a, [k]: req.body[k] }), {});
    try {
      const user = await User.findOneAndUpdate({ _id }, o, { new: true });
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message, error: error.errors });
    }
  },
  login: async (req, res) => {
    try {
      const user = await User.findByCredentials(req.body.email, req.body.password);
      await user.generateToken();
      res.status(200).json(user);
    } catch (e) {
      res.status(401).json(e);
    }
  },
  logout: async (req, res) => {
    try {
      delete req.user.token;
      await req.user.save();
      res.json();
    } catch (_error) {
      res.status(500).json();
    }
  },
  getUser: (req, res) => {
    res.json(req.user);
  },
  deleteAuthUser: async (req, res) => {
    try {
      await req.user.remove();
      res.send();
    } catch (e) {
      res.status(401).json(e);
    }
  },
  addLicense: async (req, res) => {
    const { user, body } = req;

    try {
      user.license = body;
      await user.save();
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message, error: error.errors });
    }
  },
  getRentals: async (req, res) => {
    const { user } = req;
    try {
      const rentals = await Rental.find({ user });
      res.json(rentals);
    } catch (error) {
      res.status(500).json({
        message: error.message,
        error: error.errors,
      });
    }
  },
  getRental: async (req, res) => {
    const {
      user: { _id },
    } = req;

    try {
      Rental.findOne({ user: _id, returnDate: null })
        .populate({ path: 'user', model: 'User' })
        .populate({ path: 'parkingOrigin', model: 'Parking' })
        .populate({ path: 'vehicle', model: 'Vehicle' })
        .populate({ path: 'parkingDestination', model: 'Parking' })
        .exec((err, data) => {
          if (err) {
            return res.send(err);
          }
          const rental = data;
          rental.vehicle.parking = undefined;
          rental.vehicle.category = undefined;
          return res.json(rental);
        });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        error: error.errors,
      });
    }
  },
};

module.exports = userController;
