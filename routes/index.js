const express = require('express');

const router = express.Router();

const usersRouter = require('./users');
const vehiclesRouter = require('./vehicles');

router.use('/users', usersRouter);
router.use('/vehicles', vehiclesRouter);

module.exports = router;
