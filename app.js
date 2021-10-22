const express = require('express');
// const path = require('path');
const mongoose = require('mongoose');
// const { errors } = require('celebrate');
const { celebrate, Joi, errors } = require('celebrate');
const validator = require('validator');
// const bodyParser = require('body-parser');
const routesCards = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const PORT = 3000;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false
});

// app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

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

app.use((err, req, res, next) => {
  res.send({ msg: err.message });
  next(new Error('Not Found'));
});

app.post(auth, routesCards);
app.use(errors());

app.use((err, req, res, next) => {
  res.send({ msg: err.message });
  next(new Error('Ошибка авторизации'));
});

app.listen(PORT);
