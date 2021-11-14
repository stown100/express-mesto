const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const cors = require('cors');
const bodyParser = require('body-parser');
const routesCards = require('./routes/cards');
const routesUsers = require('./routes/users');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFound = require('./errors/NotFound');

const PORT = 3000;
const app = express();
// корс №2
const corsOptions = {
  // origin: '*',
  origin: [
    'https://mesto.nomoreparties.co/v1/cohort-26',
    'https://application-mesto.nomoredomains.icu',
    'http://application-mesto.nomoredomains.icu',
    'https://api.application-mesto.nomoredomains.xyz',
    'http://api.application-mesto.nomoredomains.xyz',
    'localhost:3001',
    'http://localhost:3001',
    'https://localhost:3001',
    'https://localhost:3000',
    'http://localhost:3000',
    'localhost:3000',
  ],
  methods: ['PUT', 'GET', 'POST', 'PATCH', 'DELETE', 'HEAD'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization', 'Accept'],
  credentials: true,
};

app.use('*', cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  autoIndex: true, // make this also true
});

app.use(express.json());

app.use(requestLogger); // подключаем логгер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }),
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

app.use(auth);

app.use('/users', routesUsers);
app.use('/cards', routesCards);

app.all('*', (req, res, next) => next(new NotFound('Ресурс не найден')));

app.use(errorLogger); // подключаем логгер ошибок

app.use(errorHandler);
app.listen(PORT, () => {
  console.log('Ссылка на сервер: http://api.application-mesto.nomoredomains.xyz');
});
