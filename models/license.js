const mongoose = require('mongoose');

const beautifyUnique = require('mongoose-beautiful-unique-validation');

const { Schema } = mongoose;

const licenseSchema = new Schema({
  expireDate: {
    type: Date,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
});

licenseSchema.plugin(beautifyUnique);

const License = mongoose.model('License', licenseSchema);

module.exports = License;
