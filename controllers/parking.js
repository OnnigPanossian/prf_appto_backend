/* eslint-disable consistent-return */
/**
 * Dependencies
 */
const Parking = require('../models/parking');
const Vehicle = require('../models/vehicle');

const getAll = async (req, res) => {
  const { query } = req;

  const filterCategory = {};
  const filter = {};
  Object.keys(query).map(async (key) => {
    switch (key) {
      case 'category':
        query[key] = decodeURI(query[key]);
        const a = query[key].split(',');
        filterCategory.code = a;
        break;
      default:
        const b = query[key].split(', ');
        filter[key] = b;
        break;
    }
  });

  try {
    const garages = await Parking.find().populate({
      path: 'vehicles',
      populate: {
        path: 'category',
      },
      match: filter,
    });

    const toReturn = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < garages.length; i++) {
      const garage = garages[i];
      if (Object.keys(query).length > 0) {
        let hasVehicles = false;
        // eslint-disable-next-line no-plusplus
        if (filterCategory.hasOwnProperty('code')) {
          for (let j = 0; j < filterCategory.code.length; j++) {
            hasVehicles = garage.vehicles.some((vehicle) => vehicle.category.code === filterCategory.code[j]);
            if (hasVehicles) {
              break;
            }
          }
          if (hasVehicles) {
            toReturn.push(garage);
          }
        }
      } else {
        toReturn.push(garage);
      }
    }

    return res.status(200).json(toReturn);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

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

const getParking = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const parking = await Parking.findById(id);
    if (!parking) {
      return res.status(404).json({ message: 'Garage Not Found' });
    }
    return res.json(parking);
  } catch (error) {
    return res.status(400).json({ message: error.message, error: error.errors });
  }
};

const getVehiclesByParkingId = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const parking = await Parking.findById(id);
    if (!parking) {
      return res.status(404).json({ message: 'Garage Not Found' });
    }

    const populateParking = await parking.populate({ path: 'vehicles', populate: { path: 'category', model: 'Category' } });

    return res.status(200).json(populateParking.vehicles);
  } catch (e) {
    return res.status(400).send(e);
  }
};

const addVehicle = async (req, res) => {
  const {
    params: { id, idVehicle },
  } = req;

  try {
    const parking = await Parking.findById(id);
    if (!parking) {
      return res.status(404).json({ message: 'Garage Not Found' });
    }
    const vehicle = await Vehicle.findById(idVehicle);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle Not Found' });
    }

    if (parking.vehicles.find((v) => v.toString() === idVehicle)) {
      return res.status(404).json({ message: 'Vehicle Already In This Parking' });
    }
    parking.vehicles.push(idVehicle);
    vehicle.parking = id;
    await vehicle.save();
    await parking.save();
    return res.status(200).json(parking.vehicles);
  } catch (error) {
    return res.status(400).send(error);
  }
};
const deleteVehicle = async (req, res) => {
  const {
    params: { id, idVehicle },
  } = req;

  try {
    const parking = await Parking.findById(id);
    if (!parking) {
      return res.status(404).json({ message: 'Garage Not Found' });
    }
    const vehicle = await Vehicle.findById(idVehicle);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle Not Found' });
    }
    parking.vehicles = parking.vehicles.filter((v) => v.toString() !== idVehicle);
    vehicle.parking = null;
    await vehicle.updateOne({ vehicle, parking: null }, { parking: null });
    await parking.updateOne({ parking, vehicles: [] }, { vehicles: parking.vehicles });

    return res.status(200).json(parking.vehicles);
  } catch (error) {
    return res.status(400).send(error);
  }
};

module.exports = {
  getAll,
  createParking,
  getParking,
  getVehiclesByParkingId,
  addVehicle,
  deleteVehicle,
};
