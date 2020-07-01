const { Router } = require('express');

const router = Router();
const { Joi, celebrate } = require('celebrate');
const { readUser, createUser, login } = require('../controllers/users');
const auth = require('../middlewars/auth');

router.get('/users/me', auth, readUser);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

module.exports = router;
