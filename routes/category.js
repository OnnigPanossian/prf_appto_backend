/**
 * Dependencies
 */
const express = require('express');
const categoryController = require('../controllers/category');

/**
 * Express instance
 */
const router = express.Router();

/**
 * Routes
 */
router.get('/:id', categoryController.getCategory);
router.get('/', categoryController.getAll);
router.post('/', categoryController.createCategory);

/**
 * Expose routes
 */
module.exports = router;
