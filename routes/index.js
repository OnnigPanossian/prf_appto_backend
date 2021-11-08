/**
 * Dependencies
 */
const express = require('express');
const usersRouter = require('./users');
const vehiclesRouter = require('./vehicles');
const parkingRouter = require('./parking');
const categoryRouter = require('./category');
const auth = require('../middlewares/auth');

/**
 * Router instance
 */
const router = express.Router();

/**
 * Routes
 */
router.use('/users', usersRouter);
router.use('/vehicles', vehiclesRouter);
router.use('/parking', parkingRouter);
router.use('/category', categoryRouter);
router.use(auth);

/**
 * Expose router
 */
module.exports = router;
