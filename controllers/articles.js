const mongoose = require('mongoose');
const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-error'); // 404
const BadRequestError = require('../errors/bad-request-error'); // 400
const ForbiddenError = require('../errors/forbidden-error'); // 403

const getArticles = (req, res, next) => {
  Article.find({ owner: req.user.id })
    .then((articles) => res.status(200).send({ data: articles }))
    .catch(next);
};

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user.id,
  })
    .then((article) => res.status(201).send({
      data: {
        keyword: article.keyword,
        title: article.title,
        text: article.text,
        date: article.date,
        source: article.source,
        link: article.link,
        image: article.image,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Запрос не прошел валидацию'));
      }
      return next(err);
    });
};
const deleteArticle = (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params.articleId)) {
    return Article.findById(req.params.articleId)
      .then((article) => {
        if (article) {
          if (req.user.id == article.owner) {
            Article.findByIdAndRemove(req.params.articleId)
              .then(() => {
                res.status(200).send({
                  data: {
                    keyword: article.keyword,
                    title: article.title,
                    text: article.text,
                    date: article.date,
                    source: article.source,
                    link: article.link,
                    image: article.image,
                  },
                });
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
  getArticles,
};
