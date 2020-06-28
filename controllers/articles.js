const mongoose = require('mongoose');
const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-error'); // 404
const BadRequestError = require('../errors/bad-request-error'); // 400
const ForbiddenError = require('../errors/forbidden-error'); // 403

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user.id,
  })
    .then((article) => res.status(200).send({ data: article }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Запрос не прошел валидацию'));
      }
      return next(err);
    });
};
const deleteArticle = (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid) {
    return Article.findById(req.params.id)
      .then((card) => {
        if (card) {
          if (req.user.id == card.owner) {
            Article.findByIdAndRemove(req.params.id)
              .then(() => {
                res.status(200).send({ data: card });
              })
              .catch(next);
          } else {
            throw new ForbiddenError('Недостаточно прав для удаления статьи');
          }
        } else {
          throw new NotFoundError('Такой статьи нет');
        }
      })
      .catch(next);
  }
  return next(new BadRequestError('Запрос не прошел валидацию'));
};
module.exports = {
  createArticle,
  deleteArticle,
};
