const { check } = require('express-validator');
const auth = require('./auth');

module.exports = [
  auth,
  [
    check('status', 'Status is required')
      .not()
      .isEmpty(),
    check('skills', 'Skills is required')
      .not()
      .isEmpty(),
  ],
];
