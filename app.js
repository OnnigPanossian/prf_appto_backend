const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');
const cors = require('cors');
const dbConnect = require('./db/database');

const usersRouter = require('./routes/users');

const app = express();

dbConnect();

app.use(cors());
app.use(compression());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json({
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch {
      res.status(400).json({ error: 'Invalid JSON' });
    }
  },
}));

app.use('/api/v1', usersRouter);

app.get('*', (req, res) => {
  res.status(404).json({
    error: 'Route Not Found',
  });
});

module.exports = app;
