const express = require('express');

const router = express.Router();
const auth = require('../middlewares/auth');
const userController = require('../controllers/users');

// CREAR USUARIO
router.post('/', userController.createUser);
// LOGIN
router.post('/login', userController.login);
// LOGOUT
router.post('/logout', auth, userController.logout);
// GET DEL USUARIO AUTENTICADO
router.get('/me', auth, userController.getUser);
// DELETE DEL USUARIO AUTENTICADO
router.delete('/me', auth, userController.deleteAuthUser);

module.exports = router;
