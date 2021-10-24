const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  // хешируем пароль
  bcrypt.hash(password, 10)
    .then((password) => {
      User.create({
        name, about, avatar, email, password,
      })
        .then((user) => {
          const newUser = user.toObject();
          delete newUser.password;
          res.send(newUser);
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            const err = new Error('Переданы некорректные данные при создании пользователя');
            err.statusCode = 400;
            return next(err);
          }
          if (err.message === 'Validation failed') {
            const err = new Error('Переданы некорректные данные при создании пользователя');
            err.statusCode = 400;
            return next(err);
          }
          if (err.name === 'MongoServerError') {
            const err = new Error('При регистрации указан email, который уже существует на сервере');
            err.statusCode = 409;
            return next(err);
          }
          const error = new Error('На сервере произошла ошибка');
          error.statusCode = 500;
          return next(error);
        })
        .catch(next);
    });
};

const getMyInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => { res.status(200).send(user); })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { id } = req.params;
  return User.findById(id)
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        const err = new Error('Пользователь по указанному _id не найден');
        err.statusCode = 404;
        return next(err);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const err = new Error('Пользователь по указанному _id не найден');
        err.statusCode = 400;
        return next(err);
      }
      if (err.name === 'NotFound') {
        const err = new Error('Пользователь по указанному _id не найден');
        err.statusCode = 404;
        return next(err);
      }
      const err2 = new Error('На сервере произошла ошибка');
      err2.statusCode = 500;
      return next(err2);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        const err = new Error('Пользователь по указанному _id не найден');
        err.statusCode = 400;
        return next(err);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const err = new Error('Пользователь по указанному _id не найден');
        err.statusCode = 400;
        return next(err);
      }
      if (err.name === 'ValidationError') {
        const err = new Error('Переданы некорректные данные при обновлении профиля');
        err.statusCode = 400;
        return next(err);
      }
      const error = new Error('На сервере произошла ошибка');
      error.statusCode = 500;
      return next(error);
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        const err = new Error('Пользователь по указанному _id не найден');
        err.statusCode = 400;
        return next(err);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const err = new Error('Пользователь по указанному _id не найден');
        err.statusCode = 400;
        return next(err);
      }
      if (err.name === 'ValidationError') {
        const err = new Error('Переданы некорректные данные при обновлении профиля');
        err.statusCode = 400;
        return next(err);
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  let userId;

  return User.findOne({ email }).select('+password')
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
        'super-strong-secret',
        { expiresIn: '21d' },
      );

      res.send({ token });
    })
    .catch(next);
};

// const getUserMe = (req, res, next) => {
//   const id = req.user._id;
//   User.find({ userId: id })
//     .then((user) => {
//       if (user) {
//         res.send(user);
//       } else {
//         const err = new Error('Пользователь по указанному _id не найден');
//         err.statusCode = 404;
//         return next(err);
//       }
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         const err = new Error('Пользователь по указанному _id не найден');
//         err.statusCode = 404;
//         return next(err);
//       }
//       res.status(500).send({ message: 'Произошла ошибка' });
//     });
// };

module.exports = {
  createUser, getUsers, getUserById, updateUser, updateAvatar, login, getMyInfo,
};
