const mongoose = require('mongoose');

const beautifyUnique = require('mongoose-beautiful-unique-validation');

const { Schema } = mongoose;

const rentalSchema = new Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  withdrawalDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
  },
  parkingOrigin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parking',
    required: true,
  },
  parkingDestination:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parking',
  },
  finalPrice:
  {
    type: Number,
  },
});

rentalSchema.plugin(beautifyUnique);

const Rental = mongoose.model('Rental', rentalSchema);

module.exports = Rental;
