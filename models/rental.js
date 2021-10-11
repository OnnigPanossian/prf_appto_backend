const mongoose = require('mongoose');

const beautifyUnique = require('mongoose-beautiful-unique-validation');

const { Schema } = mongoose;

const rentalSchema = new Schema({
  vehicle: {
  },
  user: {
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
