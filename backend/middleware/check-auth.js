const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
  // by pass OPTIONS request
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    // Authorization: 'Bearer TOKEN'
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      throw new Error('Authentication failed!');
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    // console.log(`decodedToken: ${JSON.stringify(decodedToken)}`);

    req.userData = {
      userId: decodedToken.userId,
      email: decodedToken.email
    }
    next();
  } catch (err) {
    const error = new HttpError('Authentication failed!', 403);
    return next(error);
  }
};
