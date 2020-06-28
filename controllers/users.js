const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const UnautorizedError = require('../errors/unautorized-error'); // 401
const ConflictError = require('../errors/conflict-error'); // 409
const NotFoundError = require('../errors/not-found-error'); // 404
const BadRequestError = require('../errors/bad-request-error'); // 400

const readUser = (req, res, next) => {
  // Здесь нужно добавить req.user для получения id
  User.findById(req.user.id)
    .then((user) => res.send(user))
    .catch((err) => console.log(err));
};

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => res.send(user))
    .catch((err) => console.log(err));
};

const login = (req, res, next) => {
  const { password, email } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnautorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnautorizedError('Неправильные почта или пароль');
          }
          const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '7d' });
          res.cookie('jwt', token, { httpOnly: true }).end();
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  readUser,
  createUser,
  login,
};
