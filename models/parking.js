const mongoose = require('mongoose');
const validator = require('validator');

const beautifyUnique = require('mongoose-beautiful-unique-validation');

const { Schema } = mongoose;

const parkingSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (validator.isEmpty(value)) {
        throw new Error('Please enter a parking name');
      }
    },
  },
  lat: {
    type: String,
    required: true,
  },
  long: {
    type: String,
    required: true,
  },
  vehicles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
  }],
});

parkingSchema.plugin(beautifyUnique);

const Parking = mongoose.model('Parking', parkingSchema);

module.exports = Parking;
