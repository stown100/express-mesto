const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');

const regex = /https?:\/\/(www\.)?[-\w@:%\\+~#=]{1,256}\.[a-z0-9()]{1,6}\b([-\w()@:%\\+~#=//?&]*)/i;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    name: {
      type: Date,
      default: Date.now,
    },
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    about: {
      type: Date,
      default: Date.now,
    },
  },
  avatar: {
    type: String,
    required: false,
    avatar: {
      type: Date,
      default: Date.now,
    },
    validate: {
      validator(val) {
        return val.match(regex);
      },
      message: 'Введите валидный url',
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },

});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильный логин или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Непрпвильные логин или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
