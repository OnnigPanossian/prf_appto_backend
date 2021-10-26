/**
 * Dependencies
 */
const Parking = require('../models/Parking');

const getAll = async (_, res) => {
    return Parking.find().then(garages => {
        if (!garages.length) {
            return res.status(404).json({ message: 'Garages Not Found' });
        }
        return res.status(200).json(garages);
    })
        .catch(error => res.status(400).json({ message: error.message, error: error.errors }))

}

module.exports = {
    getAll
}