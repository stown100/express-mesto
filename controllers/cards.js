const Card = require('../models/card');

const getCards = (req, res) => {
  return Card.find({})
  .then((cards) => res.status(200).send(cards))
  .catch((err) => {
    console.log('Error' + err);
    res.status(500).send({msg: 'Error!'});
  })
}

const createCards = (req, res) => {
  return Card.create({...req.body})
  .then((cards) => {
    return res.status(200).send(cards);
  })
  .catch((err) => {
    console.log('Error' + err)
    return res.status(500).send({msg: 'Error!'})
  })
}

const deleteCard = (req, res) => {
  return Card.findByIdAndDelete(req.params.cardId)
  .then((card) => {
    return res.status(200).send(card);
  })
  .catch((err) => {
    console.log('Error' + err)
    return res.status(500).send({msg: 'Error!'})
  })
}

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
  )
  .then((card) => {
    return res.status(200).send(card);
  })
  .catch((err) => {
    if (err.name === 'SomeErrorName') {
      console.log('Error' + err);
      return res.status(500).send({msg: 'ошибка по-умолчанию'})
    }
  })
  .catch((err) => {
    if (err.name === 'SomeErrorName') {
      console.log('Error' + err);
      return res.status(400).send({msg: 'переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля'})
    }
  })
  .catch((err) => {
    if (err.name === 'SomeErrorName') {
      console.log('Error' + err);
      return res.status(404).send({msg: 'карточка или пользователь не найден'})
    }
  })
}

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
  )
  .then((card) => {
    return res.status(200).send(card);
  })
  .catch((err) => {
    if (err.name === 'SomeErrorName') {
      console.log('Error' + err);
      return res.status(500).send({msg: 'ошибка по-умолчанию'})
    }
  })
  .catch((err) => {
    if (err.name === 'SomeErrorName') {
      console.log('Error' + err);
      return res.status(400).send({msg: 'переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля'})
    }
  })
  .catch((err) => {
    if (err.name === 'SomeErrorName') {
      console.log('Error' + err);
      return res.status(404).send({msg: 'карточка или пользователь не найден'})
    }
  })
}

module.exports = {getCards, createCards, deleteCard, likeCard, dislikeCard};