const { check } = require('express-validator');
const auth = require('./auth');

const makeCommaSeparatedString = (arr, useOxfordComma) => {
  const listStart = arr.slice(0, -1).join(', ');
  const listEnd = arr.slice(-1);
  const conjunction =
    arr.length <= 1
      ? ''
      : useOxfordComma && arr.length > 2
      ? ', and a'
      : ' and a ';

  return [listStart, listEnd].join(conjunction);
};

const validatePassword = password => {
  const form = { msg: [], hasError: false };
  if (!password.match(/[$-/:-?{-~!"^_`[\]]/g)) {
    form.msg.push('symbol');
    form.hasError = true;
  }

  if (!password.match(/\d/g)) {
    form.msg.push('number');
    form.hasError = true;
  }

  if (!password.match(/[A-Z]/g)) {
    form.msg.push('uppercase letter');
    form.hasError = true;
  }
  if (!password.match(/[a-z]/g)) {
    form.msg.push('lowercase letter');
    form.hasError = true;
  }

  const msg = makeCommaSeparatedString(form.msg);

  return form.hasError ? msg : '';
};

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
      check('password', 'Please enter a password with 6 or more characters')
        .custom(password => {
          let msg = validatePassword(password);
          if (msg) {
            msg = 'Password must include a ' + msg;
            throw new Error(msg);
          }

          return true;
        })
        .isLength({ min: 6 }),
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
