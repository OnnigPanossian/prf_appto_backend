/**
 * Dependencies
 */
const express = require('express');
const usersRouter = require('./users');
const vehiclesRouter = require('./vehicles');
const parkingRouter = require('./parking');
const auth = require('../middlewares/auth');

/**
 * Router instance
 */
const router = express.Router();

/**
 * Routes
 */
router.use('/users', usersRouter);
router.use(auth);
router.use('/vehicles', vehiclesRouter);
router.use('/parking', parkingRouter);

/**
 * Expose router
 */
module.exports = router;
