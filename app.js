const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const cors = require('cors');
const routesCards = require('./routes/cards');
const routesUsers = require('./routes/users');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errors = require('./middlewares/errors');
// const { allowOrigin } = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
// const bodyParser = require('body-parser');
// const path = require('path');

const PORT = 3000;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  autoIndex: true, // make this also true
});

// app.use(express.static(path.join(__dirname, 'public')));

const corsOptions = {
  origin: [
    'https://application-mesto.nomoredomains.icu',
    'http://application-mesto.nomoredomains.icu',
    'https://api.application-mesto.nomoredomains.xyz',
    'http://api.application-mesto.nomoredomains.xyz',
    'localhost:3000',
  ],
  methods: ['PUT', 'GET', 'POST', 'PATCH', 'DELETE', 'HEAD'],
  preflightContinue: false,
  optionSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

app.use('*', cors(corsOptions));

app.use(express.json());

app.use(requestLogger); // подключаем логгер запросов

// app.use(allowOrigin);

// app.use(cors);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required(),
  }).unknown(true),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value, helper) => {
      if (validator.isURL(value, { require_protocol: true })) {
        return value;
      }
      return helper.message('Невалидный url');
    }),
  }),
}), createUser);

app.use('/users', auth, routesUsers);
app.use('/cards', auth, routesCards);

app.all('*', (req, res, next) => {
  const err = new Error('Ресурс не найден');
  err.statusCode = 404;
  return next(err);
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors);

// app.use((err, req, res, next) => {
//   res.send({ msg: err.message });
//   next(new Error('Ошибка авторизации'));
// });

app.listen(PORT, () => {
  console.log('Ссылка на сервер: http://api.application-mesto.nomoredomains.xyz');
});
