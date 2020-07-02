const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UnautorizedError = require('../errors/unautorized-error'); // 401
const ConflictError = require('../errors/conflict-error'); // 409
const BadRequestError = require('../errors/bad-request-error'); // 400

const readUser = (req, res, next) => {
  User.findById(req.user.id)
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({ email, password, name })
        .then((user) => {
          User.findByIdAndUpdate(user._id, { password: `${hash}` }, { new: true })
            .then((client) => res.status(201).send({ data: client }))
            .catch(next);
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return next(new BadRequestError('Запрос не прошел валидацию'));
          }
          if (err.code === 11000) {
            return next(new ConflictError('Пользователь с такой электронной почтой уже существует'));
          }
          return next(err);
        });
    })
    .catch(next);
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
          const token = jwt.sign({ id: user._id }, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
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
