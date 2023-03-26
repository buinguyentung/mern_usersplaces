const express = require('express');

const { check } = require('express-validator');

const usersController = require('../controllers/users-controller');

const usersRouter = express.Router();

usersRouter.get('/', usersController.getUsers);

usersRouter.post(
  '/signup',
  [check('email').normalizeEmail().isEmail()],
  usersController.signup
);

usersRouter.post('/login', usersController.login);

module.exports = usersRouter;
