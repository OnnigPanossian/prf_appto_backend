/* eslint-disable comma-dangle */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
/**
 * Esta dependencia formatea los errores de MongoDB
 * que estan relacionados al error por unique
 * MongoDB devuelve un error muy feo
 */
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
      trim: true,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: true,
      unique: 'Email already in use ({VALUE})',
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is not valid');
        }
      },
    },
    image: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    token: {
      type: String,
    },
    // La licencia no es requerida en el registro segun se determino en el modelo de negocio
    license: {
      expireDate: {
        type: Date,
        required: false,
        validate(value) {
          if (Date.parse(value) - Date.parse(new Date()) < 0) {
            throw new Error('Expired license');
          }
        },
      },
      number: {
        type: String,
        required: false,
      },
    },
    admin: {
      type: Boolean,
      default: false,
    },
  }
);

userSchema.plugin(beautifyUnique);

userSchema.methods.toJSON = function toJson() {
  // modelamos la respuesta de los datos del usuario
  const user = this;
  const userObject = user.toObject();
  // borramos la password para no retornarla
  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.generateToken = async function generateToken() {
  // Metodo del usuario que genera el token y se lo guarda en la BD
  const user = this;
  user.token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET);
  await user.save();

  return user.token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  // Metodo validador de credenciales
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Wrong credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Wrong credentials');
  }

  return user;
};

userSchema.pre('save', async function preSave(next) {
  // .pre() toma como parametro una accion
  // en esta caso es save
  // antes de guardar al usuario, va a hashear la pass
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
