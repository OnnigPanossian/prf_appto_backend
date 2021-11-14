const Rental = require('../models/rental');

const rentalController = {
  async pay(req, res) {
    const { id } = req.params;
    try {
      const rental = await Rental.findById(id);
      if (!rental) {
        return res.status(404)
          .json({ message: 'Rental not found' });
      }
      rental.paymentDate = new Date();
      await rental.save();
      return res.json(rental);
    } catch (error) {
      return res.status(400)
        .json({
          message: error.message,
          error: error.errors,
        });
    }
  },
};

module.exports = rentalController;
