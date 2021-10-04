const User = require('../models/user');


const getUsers = (req, res) => {
  return User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.log('Error' + err);
      res.status(500).send({msg: 'Error!'});
    })
};

const getUser = (req, res) => {
  const {id} = req.user._id;
  return User.findById(id)
    .then((user) => {
      if (user) {
        return res.status(200).send(user);
      }
      return res.status(404).send({msg: 'Not Found'});
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({msg: 'Невалидный id'});
      } else {
        console.log('Error' + err)
        return res.status(500).send({msg: 'Error!'});
      }
    })
}

const createUser = (req, res) => {
  return User.create({...req.body})
    .then((user) => {
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({msg: 'Некорректные данные'});
      } else {
        console.log('Error' + err)
        return res.status(500).send({msg: 'Error!'})
      }
    })
}

const updeteProfile = (req, res) => {
  const {id} = req.user._id;
  return User.findByIdAndUpdate({id, new: true, runValidators: true})
  .then((user) => {
    return res.status(200).send(user);
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({msg: 'Некорректные данные'});
    } else {
      console.log('Error' + err)
      return res.status(500).send({msg: 'Error!'})
    }
  })
}

const updateAvatar = (req, res) => {
  const {id} = req.user._id;
  return User.findByIdAndUpdate({id, new: true, runValidators: true})
  .then((user) => {
    return res.status(200).send(user);
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({msg: 'Некорректные данные'});
    }
    console.log('Error' + err)
    return res.status(500).send({msg: 'Error!'})
  })
}

module.exports = {getUsers, getUser, createUser, updeteProfile, updateAvatar};