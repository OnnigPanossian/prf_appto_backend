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

router.use(auth);

router.get('/me', userController.getUser);
router.delete('/me', userController.deleteAuthUser);
router.post('/license', userController.addLicense);
router.patch('/', userController.updateUser);
router.get('/rentals', userController.getRentals);

router.get('/rental', userController.getRental);

/**
 * Expose routes
 */
module.exports = router;
