/**
 * Dependencies
 */
const Parking = require('../models/parking');

const getAll = async (_, res) =>
  Parking.find()
    .then((garages) => {
      if (!garages.length) {
        return res.status(404).json({ message: 'Garages Not Found' });
      }
      return res.status(200).json(garages);
    })
    .catch((error) => res.status(400).json({ message: error.message, error: error.errors }));

const createParking = async (req, res) => {
  const { body } = req;
  const parking = new Parking(body);
  try {
    await parking.save();
    return res.status(201).json(parking);
  } catch (error) {
    return res.status(400).json({ message: error.message, error: error.errors });
  }
};

module.exports = {
  getAll,
  createParking,
};
