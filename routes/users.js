const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const {
  getUsers, getUserById, updateAvatar, updateUser, getMyInfo,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getMyInfo);
router.get('/users/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }),
}), getUserById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom((value, helper) => {
      if (validator.isURL(value, { require_protocol: true })) {
        return value;
      }
      return helper.message('Невалидный url');
    }),
  }),
}), updateAvatar);

module.exports = router;
