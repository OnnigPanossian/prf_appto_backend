const mongoose = require('mongoose');
const validator = require('validator');

const beautifyUnique = require('mongoose-beautiful-unique-validation');

const { Schema } = mongoose;

const categorySchema = new Schema({
  code: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (validator.isEmpty(value)) {
        throw new Error('Please enter a category code');
      }
    },
  },
  costPerMinute: {
    type: Number,
    min: 0,
    required: true,
    validate(value) {
      if (validator.isEmpty(value)) {
        throw new Error('Please enter a cost');
      }
    },
  },
  capacity: {
    type: Number,
    min: 2,
    max: 7,
    required: true,
  },
  trunkCapacity: {
    type: Number,
    min: 0,
    default: 0,
  },
}, {
  timestamps: true,
});

categorySchema.plugin(beautifyUnique);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
