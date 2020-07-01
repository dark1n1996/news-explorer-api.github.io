const express = require('express');
require('dotenv').config();

const app = express();
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewars/loggers');
const user = require('./routes/users');
const article = require('./routes/articles');
const pageNotExist = require('./middlewars/page-not-exist');

async function getStarted(next) {
  try {
    mongoose.connect('mongodb://localhost:27017/newsexplorerdb', {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => {
      console.log(`Server has been started on ${PORT} PORT...`);
    });
  } catch (err) {
    next(err);
  }
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);
app.use(user);
app.use(article);
app.use(pageNotExist);
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});

getStarted();
