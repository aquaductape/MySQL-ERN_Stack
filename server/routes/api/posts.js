const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config');
const { validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const CustomError = require('../../helpers/CustomError');
const validate = require('../../middleware/validate');
const db = require('../../../config/db');
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
  const post_id = req.params.post_id;
  try {
    await db.query('DELETE FROM posts WHERE ?', [{ id: post_id }]);

    return res.status(200).json({ msg: 'post removed' });
  } catch (err) {
    console.log(err);
    return res.status(500).json(new CustomError('Server Error'));
  }
});

// @route GET api/posts
// @desc  Get all posts
// @access Private
router.get('/', auth, async (req, res, next) => {
  try {
    const posts = await db.query('SELECT * FROM posts ORDER BY date DESC');

    if (!posts) {
      return res.status(404).json(new CustomError('No posts'));
    }

    const likes = await db.query('SELECT * FROM likes ORDER BY date DESC');
    const comments = await db.query(
      'SELECT * FROM comments ORDER BY date DESC'
    );

    posts.forEach(post => {
      const post_id = post.id;

      post.likes = likes.filter(like => like.post_id === post_id);
      post.comments = comments.filter(comment => comment.post_id === post_id);
    });

    return res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    return res.status(500).json(new CustomError('Server Error'));
  }
});

// @route GET api/posts
// @desc  Get all posts
// @access Private
router.get('/', auth, async (req, res, next) => {
  try {
    const posts = await db.query('SELECT * FROM posts ORDER BY date DESC');

    if (!posts) {
      return res.status(404).json(new CustomError('No posts'));
    }

    const likes = await db.query('SELECT * FROM likes ORDER BY date DESC');
    const comments = await db.query(
      'SELECT * FROM comments ORDER BY date DESC'
    );

    posts.forEach(post => {
      const post_id = post.id;

      post.likes = likes.filter(like => like.post_id === post_id);
      post.comments = comments.filter(comment => comment.post_id === post_id);
    });

    return res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    return res.status(500).json(new CustomError('Server Error'));
  }
});

// @route PUT api/posts/like/:id
// @desc  Like a post
// @access Private
router.put('/like/:id', auth, async (req, res, next) => {
  const id = req.params.id;
  const user_id = req.user.id;
  const likeFields = { post_id: id, user_id };
  try {
    const post = await db.query('SELECT * FROM posts WHERE ?', [{ id }]);
    if (!post) {
      return res.status(404).json(new CustomError('Post not Found'));
    }

    likeFields.name = post.name;
    likeFields.avatar = post.avatar;

    const likeExist = await db.query('SELECT id FROM likes WHERE ?', [
      { post_id: id },
    ]);

    if (likeExist) {
      return res.status(400).json(new CustomError('Post already liked'));
    }

    await db.query('INSERT INTO likes SET ?', [likeFields]);

    return res.status(201).json({ msg: 'Liked post' });
  } catch (err) {
    console.log(err);
    return res.status(500).json(new CustomError('Server Error'));
  }
});

// @route PUT api/posts/unlike/:id
// @desc  Unlike a post
// @access Private
router.put('/unlike/:id', auth, async (req, res, next) => {
  const id = req.params.id;
  const user_id = req.user.id;

  try {
    const post = await db.query('SELECT id FROM posts WHERE ?', [{ id }]);
    if (!post) {
      return res.status(404).json(new CustomError('Post not Found'));
    }

    const likeExist = await db.query('SELECT * FROM likes WHERE ?', [
      { post_id: id },
    ]);

    if (!likeExist) {
      return res.status(400).json(new CustomError("Post doesn't have a like"));
    }

    const correctLike = await db.query('SELECT id FROM likes WHERE ? AND ?', [
      { post_id: id },
      { user_id },
    ]);

    if (!correctLike) {
      return res.status(403).json(new CustomError('Forbidden'));
    }

    await db.query('DELETE FROM likes WHERE ? AND ?', [
      { post_id: id },
      { user_id },
    ]);

    return res.status(200).json({ msg: 'Removed like' });
  } catch (err) {
    console.log(err);
    return res.status(500).json(new CustomError('Server Error'));
  }
});

// @route PUT api/posts/comment/:id
// @desc  Add comment to post
// @access Private
router.put('/comment/:id', validate.comment, async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(new CustomError(errors.array()));
  }

  const { text } = req.body;
  const id = req.params.id;
  const user_id = req.user.id;

  const commentField = { text, user_id };

  try {
    const post = await db.query('SELECT * FROM posts WHERE ?', [{ id }]);
    if (!post) {
      return res.status(404).json(new CustomError('Post not Found'));
    }
    commentField.post_id = post.id;
    commentField.name = post.name;
    commentField.avatar = post.avatar;

    await db.query('INSERT INTO comments SET ?', [commentField]);

    return res.status(201).json({ msg: 'Added comment' });
  } catch (err) {
    console.log(err);
    return res.status(500).json(new CustomError('Server Error'));
  }
});

// @route DELETE api/posts/comment/:post_id/:comment_id
// @desc  Remove comment from post
// @access Private
router.delete('/comment/:post_id/:comment_id', auth, async (req, res, next) => {
  const user_id = req.user.id;
  const post_id = req.params.post_id;
  const comment_id = req.params.comment_id;

  try {
    const post = await db.query('SELECT * FROM posts WHERE ?', [
      { id: post_id },
    ]);
    if (!post) {
      return res.status(404).json(new CustomError('Post not Found'));
    }
    await db.query('DELETE FROM comments WHERE ? AND ? AND ?', [
      { user_id },
      { post_id },
      { id: comment_id },
    ]);

    return res.status(200).json({ msg: 'comment removed' });
  } catch (err) {
    console.log(err);
    return res.status(500).json(new CustomError('Server Error'));
  }
});

module.exports = router;
