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
router.patch('/:id', userController.updateUser);

/**
 * Expose routes
 */
module.exports = router;
