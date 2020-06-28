const express = require('express');

const app = express();
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const bodyParser = require('body-parser');
const user = require('./routes/users');
const article = require('./routes/articles');
const error = require('./middlewars/error');

async function getStarted() {
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
    console.log(err);
  }
}

getStarted();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(user);
app.use(article);
