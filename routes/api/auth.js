const express = require('express');
const router = express.Router();

const User = require('../../models/User');
const auth = require('../../middleware/auth');
const CustomError = require('../../helpers/CustomError');

router.get('/', auth, async (req, res, next) => {
  try {
    const id = req.user.id;

    const user = await User.findById(id, { filter: 'password' });

    res.status(200).json(user);
  } catch (err) {
    console.log('TCL: err', err);
    res.status(400).json(new CustomError('Server Error'));
  }
});

module.exports = router;
