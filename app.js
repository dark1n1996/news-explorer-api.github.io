const express = require('express');

const app = express();
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

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
  } catch (error) {
    console.log(error);
  }
}

getStarted();
