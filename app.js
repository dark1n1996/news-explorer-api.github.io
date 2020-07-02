const express = require('express');
require('dotenv').config();

const app = express();
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { requestLogger, errorLogger } = require('./middlewars/loggers');
const router = require('./routes/index');
const centralErrorHandler = require('./middlewars/central-error-handler');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

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
app.use(helmet());
app.use(limiter);
app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(centralErrorHandler);

getStarted();
