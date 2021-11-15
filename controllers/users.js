/* eslint-disable no-param-reassign */
const User = require('../models/user');
const Rental = require('../models/rental');

const userController = {
  async createUser(req, res) {
    const user = new User(req.body);
    if (!user) {
      return res.status(400).json({ message: 'Error creating User' });
    }
    try {
      await user.generateToken();
      return res.status(201).json(user);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },
  async updateUser(req, res) {
    const { _id } = req.user;
    const o = Object.keys(req.body)
      .filter((k) => req.body[k] !== null && req.body[k] !== '' && req.body[k] !== undefined)
      .reduce((a, k) => ({ ...a, [k]: req.body[k] }), {});
    try {
      const user = await User.findOneAndUpdate({ _id }, o, { new: true });
      res.json(user);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  async login(req, res) {
    try {
      const user = await User.findByCredentials(req.body.email, req.body.password);
      await user.generateToken();
      res.status(200).json(user);
    } catch (e) {
      res.status(401).json(e);
    }
  },
  async logout(req, res) {
    try {
      delete req.user.token;
      await req.user.save();
      res.json();
    } catch (_err) {
      res.status(500).json();
    }
  },
  async getUser(req, res) {
    res.json(req.user);
  },
  async deleteAuthUser(req, res) {
    try {
      await req.user.remove();
      res.send();
    } catch (e) {
      res.status(401).json(e);
    }
  },
  async addLicense(req, res) {
    const { user, body } = req;

    try {
      user.license = body;
      await user.save();
      res.json(user);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  async getRentals(req, res) {
    const { user } = req;

    Rental.find({ user })
      .populate({ path: 'user', model: 'User' })
      .populate({ path: 'parkingOrigin', model: 'Parking' })
      .populate({ path: 'vehicle', model: 'Vehicle' })
      .populate({ path: 'parkingDestination', model: 'Parking' })
      .exec((err, data) => {
        if (err) {
          return res.send(err);
        }
        data.forEach((r) => {
          r.vehicle.parking = undefined;
          r.vehicle.category = undefined;
        });
        return res.json(data);
      });
  },
  async getRental(req, res) {
    const {
      user: { _id },
    } = req;

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
  },
};

module.exports = userController;
