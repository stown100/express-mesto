const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const getUsers = (req, res, next) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch((err) => {
    if (err.name === 'CastError') {
      const err = new Error('Ошибка авторизации');
      err.statusCode = 500;
      return next(err);
    }
  });

const getUser = (req, res, next) => {
  const { id } = req.params;
  return User.findById(id)
    .then((user) => {
      if (user) {
        return res.status(200).send(user);
      }
      const err = new Error('Not Found');
      err.statusCode = 404;
      next(err);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const err = new Error('Ошибка авторизации');
        err.statusCode = 400;
        next(err);
      } else {
        const err = new Error('Ошибка на сервере');
        err.statusCode = 500;
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const id = req.user._id;
  const { name, about } = req.params;
  return User.findByIdAndUpdate(id, { name, about },
    { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.avatar === 'ValidationError') {
        const err = new Error('Невалидное поле');
        err.statusCode = 400;
        next(err);
      } else {
        const err = new Error('Ошибка на сервере');
        err.statusCode = 500;
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.params;
  return User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.avatar === 'ValidationError') {
        const err = new Error('Невалидное поле');
        err.statusCode = 400;
        next(err);
      } else {
        const err = new Error('Ошибка на сервере');
        err.statusCode = 500;
        next(err);
      }
    });
};

const createUser = (req, res, next) => User.create({ ...req.body })
  .then((user) => res.status(200).send(user))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      const err = new Error('Невалидное поле');
      err.statusCode = 400;
      next(err);
    } else {
      const err = new Error('Ошибка на сервере');
      err.statusCode = 500;
      next(err);
    }
  });

const login = (req, res, next) => {
  const { email, password } = req.body;
  let userId;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        const err = new Error('Неправильные почта или пароль');
        err.statusCode = 401;
        return next(err);
      }
      userId = user._id;
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        const err = new Error('Неправильные почта или пароль');
        err.statusCode = 401;
        return next(err);
      }
      // аутентификация успешна
      const token = jwt.sign(
        { _id: userId },
        'some-secret-key',
        { expiresIn: '21d' },
      );
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUsers, getUser, createUser, login, updateAvatar, updateUser,
};
