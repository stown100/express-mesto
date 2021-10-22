const Card = require('../models/card');

const getCards = (req, res, next) => Card.find({})
  .then((cards) => res.send(cards))
  .catch(next);

const createCards = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  return Card.create({ owner, name, link })
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const err = new Error('Переданы некорректные данные при создании карточки');
        err.statusCode = 400;
        return next(err);
      }
      if (err.message === 'Validation failed') {
        const err = new Error('Переданы некорректные данные при создании карточки');
        err.statusCode = 400;
        return next(err);
      }
      const error = new Error('На сервере произошла ошибка');
      error.statusCode = 500;
      return next(error);
    })
    .catch(next);
};

const deleteCard = (req, res, next) => Card.findByIdAndDelete(req.params.cardId)
  .then((card) => {
    if (!card) throw new Error('Нет карточки/пользователя по заданному id');
    return res.status(400).send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      const err = new Error('Невалидный id');
      err.statusCode = 403;
      return next(err);
    }
    if (err.message === 'Нет карточки/пользователя по заданному id') {
      const err = new Error('Нет карточки/пользователя по заданному id');
      err.statusCode = 404;
      next(err);
    }
    const error = new Error('На сервере произошла ошибка');
    error.statusCode = 500;
    return next(error);
  });

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавляю _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) throw new Error('Нет карточки/пользователя по заданному id');
      return res.status(400).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const err = new Error('Невалидный id');
        err.statusCode = 403;
        next(err);
      }
      if (err.message === 'Нет карточки/пользователя по заданному id') {
        const err = new Error('Нет карточки/пользователя по заданному id');
        err.statusCode = 404;
        next(err);
      }
      const error = new Error('На сервере произошла ошибка');
      error.statusCode = 500;
      return next(error);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) throw new Error('Нет карточки/пользователя по заданному id');
      return res.status(400).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const err = new Error('Невалидный id');
        err.statusCode = 403;
        next(err);
      }
      if (err.message === 'Нет карточки/пользователя по заданному id') {
        const err = new Error('Нет карточки/пользователя по заданному id');
        err.statusCode = 404;
        next(err);
      }
      const error = new Error('На сервере произошла ошибка');
      error.statusCode = 500;
      return next(error);
    });
};

module.exports = {
  getCards, createCards, deleteCard, likeCard, dislikeCard,
};
