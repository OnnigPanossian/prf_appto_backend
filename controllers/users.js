const User = require('../models/user');

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
    const _id = req.params.id;
    try {
      const user = await User.updateOne({ _id }, req.body);
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
    } catch {
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
  async addLicense(req, res) {
    const { user, body } = req;

    try {
      user.license = body;
      await user.save();
      res.json(user);
    } catch (error) {
      return res.status(400).json({ message: error.message, error: error.errors });
    }
  },
};

module.exports = userController;
