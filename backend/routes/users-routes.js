const express = require('express');

const { check } = require('express-validator');
const fileUpload = require('../middleware/file-upload');

const usersController = require('../controllers/users-controller');

const usersRouter = express.Router();

usersRouter.get('/', usersController.getUsers);

usersRouter.post(
  '/signup',
  fileUpload.single('image'), //middleware for file upload
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  usersController.signup
);

usersRouter.post('/login', usersController.login);

module.exports = usersRouter;
