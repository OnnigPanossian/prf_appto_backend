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
    
    const { _id } = req.user
    let o = Object.keys(req.user._doc)
    .filter((k) => req.user[k] != null)
    .reduce((a, k) => ({ ...a, [k]: req.user[k] }), {});
    console.log(o)
   try {
      const user = await User.updateOne({ _id }, o);
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
      const rental = await Rental.findOne({ user: _id, returnDate: null });
      res.json(rental);
    } catch (error) {
      res.status(500).json({
        message: error.message,
        error: error.errors,
      });
    }
  },
};

module.exports = userController;
