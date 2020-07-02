const { Router } = require('express');
const { Joi, celebrate } = require('celebrate');
const validator = require('validator');
const mongoose = require('mongoose');
const { getArticles, createArticle, deleteArticle } = require('../controllers/articles');
const auth = require('../middlewars/auth');

const router = Router();

const isUrlValidator = (v, h) => {
  if (!validator.isURL(v)) {
    return h.error('any.invalid');
  }
  return v;
};

const objectIdValidator = (v, h) => {
  if (!mongoose.Types.ObjectId.isValid(v)) {
    return h.error('any.invalid');
  }
  return v;
};

router.get('/articles', auth, getArticles);
router.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom(isUrlValidator, 'isUrl'),
    image: Joi.string().required().custom(isUrlValidator, 'isUrl'),
  }),
}), auth, createArticle);
router.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().alphanum().custom(objectIdValidator, 'idValidator'),
  }),
}), auth, deleteArticle);

module.exports = router;
