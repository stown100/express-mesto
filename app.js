const express = require('express');
const path = require('path');
const routesUsers = require('./routes/users');
const routesCards = require('./routes/cards');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const PORT = 3000;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false
});

app.use((req, res, next) => {
  req.user = {
    _id: '61589e22010c775ed5e172ba'
  };

  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.use(routesUsers);
app.use(routesCards);


app.listen(PORT, () => {
  console.log('Express is running')
})
