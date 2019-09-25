const { check } = require('express-validator');
const auth = require('./auth');

module.exports = {
  profile: [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills is required')
        .not()
        .isEmpty(),
    ],
  ],
  comment: [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty(),
    ],
  ],
  user: {
    login: [
      check('email', 'Please enter a valid email').isEmail(),
      check('password', 'Password is required').exists(),
    ],
    signUp: [
      check('name', 'Name is required')
        .not()
        .isEmpty(),
      check('email', 'Please enter a valid email').isEmail(),
      check(
        'password',
        'Please enter a password with 6 or more characters'
      ).isLength({ min: 6 }),
    ],
  },
  education: [
    auth,
    [
      check('school', 'School is required')
        .not()
        .isEmpty(),
      check('fieldofstudy', 'Fieldofstudy is required')
        .not()
        .isEmpty(),
      check('degree', 'Degreee is required')
        .not()
        .isEmpty(),
      check('date_from', 'From date is required')
        .not()
        .isEmpty(),
    ],
  ],
  experience: [
    auth,
    [
      check('title', 'Title is required')
        .not()
        .isEmpty(),
      check('company', 'Company is required')
        .not()
        .isEmpty(),
      check('date_from', 'From date is required')
        .not()
        .isEmpty(),
    ],
  ],
  post: [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty(),
    ],
  ],
};
