const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const {
  getUsers, getUser, updateAvatar, updateUser,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), getUser);
// router.post('/users', celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().required().min(2).max(30),
//     about: Joi.string().required().min(2).max(30),
//   }).unknown(true),
// }), createUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }).unknown(true),
}), updateUser);

// router.patch('/users', celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().required(),
//   }).unknown(true),
// }), login);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    link: Joi.string().custom((value, helper) => {
      if (validator.isURL(value, { require_protocol: true })) {
        return value;
      }
      return helper.message('Невалидный url');
    }),
  }).unknown(true),
}), updateAvatar);

module.exports = router;
