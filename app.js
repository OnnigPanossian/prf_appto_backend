const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');
const cors = require('cors');
const dbConnect = require('./db/database');
const routes = require('./routes/index')

const app = express();

dbConnect();

const PORT = process.env.PORT ?? 5000

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

<<<<<<< HEAD
app.get('/ping', (req, res) => res.json("pong"))
app.use('/api/v1', routes)
=======
app.use('/api/v1', usersRouter);
app.use('/api/v1', vehiclesRouter);
>>>>>>> 62faa22e6d79d96e6c44de6732c6009a5994de09

app.get('*', (req, res) => {
  res.status(404).json({
    error: 'Route Not Found',
  });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;
