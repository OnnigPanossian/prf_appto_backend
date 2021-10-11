const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    // tomo el token que viene por el header
    let token = req.header('Authorization');
    if (!token) {
      // Si no envia el token, no es autorizado
      throw new Error('Unauthorized');
    }
    token = token.replace('Bearer ', '');
    // verifico que sea válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // luego busco un usuario que coincida con los datos decodificados y el token
    const user = await User.findOne({ _id: decoded.id, token });

    if (!user) {
      throw new Error('Unauthorized');
    }

    req.token = token; // le paso los datos por el req al next
    req.user = user; // de ésta manera obtengo al usuario después de ejecutar el middleware
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

module.exports = auth;
