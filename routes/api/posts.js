const connection = require('../../config/db');
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  connection.query('SELECT * FROM users', (error, results, fields) => {
    if (error) {
      // should not be used for production, use custom error instead
      res.status(400).json(error);
    }

    res.status(200).json(results);
  });
});

module.exports = router;
