const HttpError = require('../models/http-error');
// const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');

// Models
const User = require('../models/users-model');

/**
 * Getting the list of users.
 */
const getUsers = async (req, res, next) => {
  console.log('GET users');
  // res.status(200).json({users: DUMMY_USERS});
  let users = [];
  try {
    users = await User.find({}, '-password'); //DO NOT RETURN PASSWORD
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Something went wrong. Could not find users.', 500)
    );
  }

  res
    .status(200)
    .json({ users: users.map((u) => u.toObject({ getters: true })) }); // convert _id to id
};

/**
 * Signing up.
 */
const signup = async (req, res, next) => {
  console.log('POST signup user');
  // validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError('Invalid user input passed! Please try again!', 422)
    );
  }

  // extract input
  const { name, email, password } = req.body;

  // const hasUser = DUMMY_USERS.find(u => u.email === email);
  // if (hasUser) {
  //   throw new HttpError('Email is already registered!', 422);
  // }
  // DUMMY_USERS.push(createdUser);
  // res.status(201).json({user: createdUser});

  // check if user already exists
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch {
    console.log(err);
    return next(
      new HttpError('Something went wrong. Could not create user.', 500)
    );
  }
  // console.log('existingUser = ' + existingUser);
  if (existingUser) {
    return next(new HttpError('Email is already registered!', 422));
  }

  // create new user
  const createdUser = new User({
    name,
    email,
    password,
    image: '/images/fantasy-goku.png',
    places: [],
  });
  try {
    await createdUser.save();
  } catch (err) {
    console.log(err);
    return next(new HttpError('Signup failed. Please try again.', 500));
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

/**
 * Logging in.
 */
const login = async (req, res, next) => {
  console.log('POST login');
  const { email, password } = req.body;

  // const user = DUMMY_USERS.find(u => u.email === email);
  // if (!user || user.password !== password) {
  //   throw new HttpError('Wrong email or password!', 401);
  // }

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch {
    console.log(err);
    return next(
      new HttpError('Something went wrong. Could not create user.', 500)
    );
  }
  // console.log('existingUser = ' + existingUser);
  if (!existingUser || existingUser.password !== password) {
    return next(new HttpError('Wrong email or password!', 401));
  }

  res
    .status(200)
    .json({
      message: 'Login successfully!',
      user: existingUser.toObject({ getters: true }),
    });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
