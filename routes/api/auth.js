const express = require('express');
const config = require('config');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../../models/User');
const Profile = require('../../models/Profile');
const auth = require('../../middleware/auth');
const CustomError = require('../../helpers/CustomError');
const validateUser = require('../../middleware/validateUser');

router.get('/', auth, async (req, res, next) => {
  try {
    const id = req.user.id;

    const profile = await Profile.findOne({ user_id: id });

    if (!profile) {
      return res
        .status(400)
        .json(new CustomError('There is no profile for this user'));
    }

    res.status(200).json(profile);
  } catch (err) {
    console.log('TCL: err', err);
    res.status(400).json(new CustomError('Server Error'));
  }
});

router.post('/', validateUser.login(), async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(new CustomError(errors.array()));
  }

  const { email, password } = req.body;
  // Prettier/vscode is messing up the object property if it has hyphen
  if (req.headers['content-type'] !== 'application/json') {
    return res.status(400).json({ msg: 'Invalid content type' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json(new CustomError('Invalid email or password'));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json(new CustomError('Invalid email or password'));
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;

        return res.status(200).json({ token });
      }
    );
  } catch (err) {
    console.log('TCL: err', err);
    return res.status(500).json(new CustomError('Server Error'));
  }
});

module.exports = router;
