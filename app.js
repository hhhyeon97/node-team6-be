const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const indexRouter = require('./routes/index');
require('dotenv').config();

const passport = require('./config/passport');
const session = require('express-session');

const LOCAL_DB_ADDRESS = process.env.LOCAL_DB_ADDRESS;
const MONGODB_URI_PROD = process.env.MONGODB_URI_PROD;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// /api가 붙은 주소로 오면 indexRouter로 보낸다
app.use('/api', indexRouter);

// app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
// app.use(passport.initialize());
// app.use(passport.session());

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI_PROD);
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
