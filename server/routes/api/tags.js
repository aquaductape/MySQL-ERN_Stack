const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const computerLanguages = require('../../data/list-of-programming-languages/data.json');

router.get('/', auth, (req, res) => {
  res.status(200).json(computerLanguages);
});

module.exports = router;
