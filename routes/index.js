/**
 * Dependencies
 */
const express = require('express');
const usersRouter = require('./users');
const vehiclesRouter = require('./vehicles');

/**
 * Router instance
 */
const router = express.Router();

/**
 * Routes
 */
router.use('/users', usersRouter);
router.use('/vehicles', vehiclesRouter);

/**
 * Expose router
 */
module.exports = router;
