const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const indexRouter = require('./routes/index');
require('dotenv').config();

const LOCAL_DB_ADDRESS = process.env.LOCAL_DB_ADDRESS;
const MONGODB_URI_PROD = process.env.MONGODB_URI_PROD;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// /api가 붙은 주소로 오면 indexRouter로 보낸다
app.use('/api', indexRouter);

// mongoose
//   .connect(MONGODB_URI_PROD, { useNewUrlParser: true })
//   .then(() => console.log('mongoose connected !'))
//   .catch((err) => console.log('db connection fail', err));

// app.listen(process.env.PORT || 5000, () => {
//   console.log('server on');
// });

const connectDB = async () => {
  try {
    await mongoose.connect(LOCAL_DB_ADDRESS);
    console.log('mongoose connected !');
    app.listen(process.env.PORT || 5000, () => {
      console.log('server on');
    });
  } catch (err) {
    console.log('db connection fail', err);
    process.exit(1);
  }
};
connectDB();
