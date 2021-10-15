const express = require('express');
// const path = require('path');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
// const bodyParser = require('body-parser');
const routesCards = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
// const validator = require('validator');

const PORT = 3000;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false
});

// app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.post('/sigin', login);
app.post('/signup', createUser);
app.use((req, res) => res.status(404).send({ message: 'Такого роута не существует' }));

app.use(auth);
app.use(routesCards);
app.use(errors());

app.use((err, req, res, next) => {
  res.send({ msg: err.message });
  next(new Error('Ошибка авторизации'));
})

app.listen(PORT);
