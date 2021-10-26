/**
 * Dependencies
 */
const express = require('express');
const auth = require('../middlewares/auth');
const userController = require('../controllers/users');

/**
 * Express instance
 */
const router = express.Router();

/**
 * Routes
 */
router.post('/', userController.createUser);
router.post('/login', userController.login);
router.post('/logout', auth, userController.logout);
router.get('/me', auth, userController.getUser);
router.delete('/me', auth, userController.deleteAuthUser);

/**
 * Expose routes
 */
module.exports = router;
