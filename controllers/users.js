const jwt = require('jsonwebtoken');
const User = require('../models/user');

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch((err) => {
    err.statusCode = 500;
    next(err);
  });

const getUser = (req, res) => {
  const { id } = req.params;
  return User.findById(id)
    .then((user) => {
      if (user) {
        return res.status(200).send(user);
      }
      return res.status(404).send({ msg: 'Not Found' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        err.statusCode = 400;
        next(err);
      } else {
        err.statusCode = 500;
        next(err);
      }
    });
};

const createUser = (req, res) => User.create({ ...req.body })
  .then((user) => res.status(200).send(user))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      err.statusCode = 400;
      next(err);
    } else {
      err.statusCode = 500;
      next(err);
    }
  });

const updateAvatar = (req, res) => {
  const id = req.user._id;
  const { avatar } = req.params;
  return User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.avatar === 'ValidationError') {
        err.statusCode = 400;
        next(err);
      }
      err.statusCode = 500;
      next(err);
    });
};

const login = (req, res) => {
  const { email, password } = req.params;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильный логин или пароль'));
      }
      return res.send({ token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '21d' }) });
    })
    .cach((err) => {
      if (err.email === 'ValidationError') {
        err.statusCode = 400;
        next(err);
      }
      err.statusCode = 500;
      next(err);
    });
};

module.exports = {
  getUsers, getUser, createUser, login, updateAvatar,
};
