const mongoose = require('mongoose');
const validator = require('validator');

const beautifyUnique = require('mongoose-beautiful-unique-validation');

const { Schema } = mongoose;

const vehicleSchema = new Schema({
  brand: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (validator.isEmpty(value)) {
        throw new Error('Please enter a brand');
      }
    },
  },
  model: {
    type: String,
    minLenght: [2, 'Model must be at least 2 characters long'],
    maxLength: [20, 'Model must be less than 20 characters long'],
    trim: true,
    lowercase: true,
    required: true,
    validate(value) {
      if (validator.isEmpty(value)) {
        throw new Error('Please enter a model');
      }
    },
  },
  year: {
    type: Number,
    min: [2000, 'Year must be greater than 2000'],
    max: [new Date().getFullYear(), 'Year must be less than current year'],
    required: true,
  },
  category: {
  },
  parking: {
  },
  engine: {
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  timesRated: {
    type: Number,
    min: 0,
    default: 0,
  },
}, {
  timestamps: true,
});

vehicleSchema.plugin(beautifyUnique);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
