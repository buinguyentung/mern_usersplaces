const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const placesRouter = require('./routes/places-routes');
const usersRouter = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

// Parse and convert all json data
app.use(bodyParser.json());

// Serving images statically
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

// Fix CORS error
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use('/api/v1/places', placesRouter);
app.use('/api/v1/users', usersRouter);

// Handle unsupported routes
app.use((req, res, next) => {
  const error = new HttpError('Route is unsupported', 404);
  throw error;
});

// Handle response errors
app.use((error, req, res, next) => {
  // roll back image if validation fails
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log('[ERROR] File remove failed: ' + err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

const port = 5000;

const start = async () => {
  // Establish the DB connection before running server
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lysihln.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    );
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
