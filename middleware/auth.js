const jwt = require('jsonwebtoken');
const config = require('config');
const CustomError = require('../helpers/CustomError');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check token
  if (!token) {
    return res
      .status(401)
      .json(new CustomError('No token, authorization denied'));
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwt.secret'));

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json(new CustomError('Token is not valid'));
  }
};
