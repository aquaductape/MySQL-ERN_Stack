const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const router = express.Router();

const User = require('../../models/User');
const CustomError = require('../../helpers/CustomError');
const validateUser = require('../../middleware/validateUser');

router.post('/', validateUser.signUp(), async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(new CustomError(errors.array()));
  }

  const { name, email, password } = req.body;
  // Prettier/vscode is messing up the object property if it has hyphen
  if (req.headers['content-type'] !== 'application/json') {
    return res.status(400).json({ msg: 'Invalid content type' });
  }

  try {
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json(new CustomError('Email is already taken'));
    }

    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm',
    });

    const newUser = { name, email, password, avatar };
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    newUser.date = 'now()';

    // returns user id
    const results = await User.add(newUser);

    const payload = {
      user: {
        id: results.insertId,
      },
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;

        return res.status(201).json({ token });
      }
    );
  } catch (err) {
    console.log('TCL: err', err);
    return res.status(500).json(new CustomError('Server Error'));
  }
});

module.exports = router;
