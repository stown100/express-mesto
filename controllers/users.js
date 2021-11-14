// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const User = require('../models/user');
// const AuthorizedError = require('../errors/AuthorizedError');
// const CastError = require('../errors/CastError');
// const NotFound = require('../errors/NotFound');
// const ConflictError = require('../errors/ConflictError');

// const createUser = (req, res, next) => {
//   console.log('11');
//   const {
//     name, about, avatar, email, password,
//   } = req.body;
//   User.findOne({ email });
//   // хешируем пароль
//   bcrypt.hash(password, 10)
//     .then((password) => {
//       User.create({
//         name, about, avatar, email, password,
//       })
//         .then((user) => {
//           const newUser = user.toObject();
//           delete newUser.password;
//           res.send(newUser);
//         })
//         .catch((err) => {
//           if (err.name === 'ValidationError') {
//             next(new CastError('Переданны некорректные данные'));
//           }
//           if (err.name === 'MongoServerError' || err.message === 'Validation failed') {
//             next(new ConflictError(
// 'При регистрации указан email, который уже существует на сервере'));
//           }
//           const error = new Error('На сервере произошла ошибка');
//           error.statusCode = 500;
//           return next(error);
//         })
//         .catch(next);
//     });
// };

// const getUsers = (req, res, next) => {
//   console.log('22');
//   User.find({})
//     .then((users) => res.send(users))
//     .catch(next);
// };

// const getUserById = (req, res, next) => {
//   console.log('33');
//   const id = req.params.userId;
//   return User.findById({ _id: id })
//     .orFail(new NotFound('Пользователя с таким id не существует'))
//     .then((user) => {
//       if (user) {
//         res.send(user);
//       } else {
//         next(new NotFound('Пользователя с таким id не существует'));
//       }
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new CastError('Переданны некорректные данные'));
//       }
//       if (err.name === 'NotFound') {
//         next(new NotFound('Пользователя с таким id не существует'));
//       }
//       const error = new Error('На сервере произошла ошибка');
//       error.statusCode = 500;
//       return next(error);
//     })
//     .catch(next);
// };

// const updateUser = (req, res, next) => {
//   console.log('44');
//   const userId = req.user._id;
//   const { name, about } = req.body;

//   User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
//     .orFail(new NotFound('Пользователя с таким id не существует'))
//     .then((user) => {
//       if (user) {
//         res.send(user);
//       } else {
//         next(new CastError('Переданны некорректные данные'));
//       }
//     })
//     .catch((err) => {
//       if (err.name === 'CastError' || err.name === 'ValidationError') {
//         next(new CastError('Переданны некорректные данные'));
//       }
//       const error = new Error('На сервере произошла ошибка');
//       error.statusCode = 500;
//       return next(error);
//     })
//     .catch(next);
// };

// const updateAvatar = (req, res, next) => {
//   console.log('55');
//   const userId = req.user._id;
//   const { avatar } = req.body;

//   User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
//     .orFail(new NotFound('Пользователя с таким id не существует'))
//     .then((user) => {
//       if (user) {
//         res.send(user);
//       } else {
//         next(new CastError('Переданны некорректные данные'));
//       }
//     })
//     .catch((err) => {
//       if (err.name === 'CastError' || err.name === 'ValidationError') {
//         next(new CastError('Переданны некорректные данные'));
//       }
//       const error = new Error('На сервере произошла ошибка');
//       error.statusCode = 500;
//       return next(error);
//     })
//     .catch(next);
// };

// const login = (req, res, next) => {
//   console.log('66');
//   const { email, password } = req.body;

//   let userId;

//   User.findOne({ email }).select('+password')
//     .then((user) => {
//       if (!user) {
//         next(new AuthorizedError('Неправильные почта или пароль'));
//       }
//       userId = user._id;
//       return bcrypt.compare(password, user.password);
//     })
//     .then((matched) => {
//       if (!matched) {
//         next(new AuthorizedError('Неправильные почта или пароль'));
//       }

//       // аутентификация успешна
//       const token = jwt.sign(
//         { _id: userId },
//         'super-strong-secret',
//         { expiresIn: '21d' },
//       );

//       res.send({ token });
//     })
//     .catch((err) => {
//       next(new AuthorizedError(err.message)); // обработка ошибки для роутов без авторизации
//     });
// };

// const getUserMe = (req, res, next) => {
//   console.log('77');
//   const id = req.user._id;
//   User.find({ _id: id })
//     .orFail(new NotFound('Пользователя с таким id не существует'))
//     .then((user) => {
//       if (user) {
//         res.send(user);
//       } else {
//         next(new NotFound('Пользователя с таким id не существует'));
//       }
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new CastError('Переданны некорректные данные'));
//       }
//       const error = new Error('На сервере произошла ошибка');
//       error.statusCode = 500;
//       return next(error);
//     });
// };

// module.exports = {
//   createUser, getUsers, getUserById, updateUser, updateAvatar, login, getUserMe,
// };

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const AuthorizedError = require('../errors/AuthorizedError');
const CastError = require('../errors/CastError');
const NotFound = require('../errors/NotFound');
const ConflictError = require('../errors/ConflictError');

const { JWT_SECRET = 'dev-key' } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFound('Пользователя с таким id не существует'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Переданны некорректные данные'));
      }
      next(err);
    });
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFound('Пользователя с таким id не существует'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Переданны некорректные данные'));
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about,
    avatar, email,
    password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Пользователь с таким email уже существует');
      } bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name,
          about,
          avatar,
          email,
          password: hash,
        }))
        .then((user2) => {
          res.send({
            name: user2.name,
            about: user2.about,
            avatar: user2.avatar,
            email: user2.email,
          });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new CastError('Переданны некорректные данные'));
          }
          next(err);
        });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFound('Пользователя с таким id не существует'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new CastError('Переданны некорректные данные'));
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFound('Пользователя с таким id не существует'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new CastError('Переданны некорректные данные'));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' });

      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      }).status(200).send({ token });
    })
    .catch((err) => {
      next(new AuthorizedError(err.message));
    });
};

// module.exports.logout = (req, res) => {
//   res.clearCookie('jwt', {
//     httpOnly: true,
//     sameSite: 'none',
//     secure: true,
//   }).status(200).end();
// };
