const mongoose = require('mongoose');

const beautifyUnique = require('mongoose-beautiful-unique-validation');

const { Schema } = mongoose;

const rentalSchema = new Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  withdrawalDate: {
    type: Date,
  },
  returnDate: {
    type: Date,
  },
});

rentalSchema.plugin(beautifyUnique);

const Rental = mongoose.model('Vehicle', rentalSchema);

module.exports = Rental;
