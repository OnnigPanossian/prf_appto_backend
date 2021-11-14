const express = require('express');
const auth = require('../middlewares/auth');
const rentalController = require('../controllers/rental');

const router = express.Router();

router.post('/pay/:id', rentalController.pay);

module.exports = router;
