const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config');
const { validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const CustomError = require('../../helpers/CustomError');
const validate = require('../../middleware/validate');
const db = require('../../config/db');
// const Post = require('../../models/Post');

// @route POST api/posts
// @desc  Add post
// @access Private
router.post('/', validate.post, async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(new CustomError(errors.array()));
  }

  const { text } = req.body;
  const user_id = req.user.id;
  try {
    const { name, avatar } = await db.query(
      'SELECT name, avatar FROM users WHERE ?',
      [{ id: user_id }]
    );

    const newPost = {
      text,
      user_id,
      name,
      avatar,
    };

    const results = await db.query('INSERT INTO posts SET ?', [newPost]);
    const post = await db.query('SELECT * FROM posts WHERE ?', [
      { id: results.insertId },
    ]);
    post.likes = [];
    post.comments = [];

    res.status(201).json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json(new CustomError('Server Error'));
  }
});

// @route DELETE api/posts/:post_id
// @desc  Remove post
// @access Private
router.delete('/:post_id', auth, async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(new CustomError(errors.array()));
  }

  const post_id = req.params.post_id;
  try {
    await db.query('DELETE FROM posts WHERE ?', [{ id: post_id }]);

    return res.status(200).json({ msg: 'post removed' });
  } catch (err) {
    console.log(err);
    return res.status(500).json(new CustomError('Server Error'));
  }
});

module.exports = router;
