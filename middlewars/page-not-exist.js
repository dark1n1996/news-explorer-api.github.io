const NotFoundError = require('../errors/not-found-error');

const pageNotExist = (req, res, next) => next(new NotFoundError('Такой страницы не сущестствует'));

module.exports = pageNotExist;
