const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config');
const { validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const CustomError = require('../../helpers/CustomError');
const validate = require('../../middleware/validate');
const db = require('../../../config/db');
const select = require('../../helpers/select');

const cleanJson = obj => {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && obj[key] != null) cleanJson(obj[key]);
    else obj[key] == null && delete obj[key];
  });
};

const cleanInput = obj => {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && obj[key] != null) cleanINput(obj[key]);
    else obj[key] === undefined && delete obj[key];
  });
};

// @route GET api/me
// @desc Get personal profile
// @access private
router.get('/me', auth, async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const profile = await db.query('SELECT ?? FROM profile WHERE profile.?', [
      select.profile,
      { user_id },
    ]);

    if (!profile) {
      return res
        .status(404)
        .json(new CustomError('There is no profile for this user'));
    }
    const skills = await db.query('SELECT skill FROM skills WHERE ?', [
      { user_id },
    ]);

    profile.skills =
      (Array.isArray(skills)
        ? skills.map(({ skill }) => skill)
        : [skills.skill]) || [];

    const education =
      (await db.query(
        'SELECT ?? FROM education WHERE ? ORDER BY date_from DESC',
        [select.education, { user_id }]
      )) || [];

    const experience =
      (await db.query(
        'SELECT ?? FROM experience WHERE ? ORDER BY date_from DESC',
        [select.experience, { user_id }]
      )) || [];

    const social =
      (await db.query('SELECT ?? FROM social WHERE ?', [
        select.social,
        { user_id },
      ])) || {};

    profile.education = Array.isArray(education) ? education : [education];
    profile.experience = Array.isArray(experience) ? experience : [experience];
    profile.social = social;
    cleanJson(profile);
    res.status(200).json(profile);
  } catch (err) {
    console.log('TCL: err', err);
    res.status(500).json(new CustomError('Server Error'));
  }
});

// @route POST api/
// @desc Create or update personal profile
// @access private
router.post('/', validate.profile, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(new CustomError(errors.array()));
  }

  let statusCode = 201;
  const {
    status,
    company,
    website,
    location,
    bio,
    skills,
    githubusername,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin,
  } = req.body;

  const profileFields = {
    status,
    company,
    website,
    location,
    bio,
    githubusername,
  };

  const social = {
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin,
  };
  cleanInput(social);

  const user_id = req.user.id;
  profileFields.user_id = user_id;
  social.user_id = user_id;

  try {
    const profileExist = await db.query('SELECT id FROM profile WHERE ?', [
      { user_id },
    ]);

    if (profileExist) {
      profileFields.id = profileExist.id;
      statusCode = 200;
    }
    const newProfile = await db.query(
      'REPLACE INTO profile SET ?; SELECT ?? FROM profile WHERE ?',
      [profileFields, select.profile, { user_id }]
    );

    const skillsArr = skills.split(/\,\s*/).filter(skill => skill);

    // delete all user's skills
    await db.query('DELETE FROM skills WHERE ?', [{ user_id }]);

    for (let skill of skillsArr) {
      await db.query('INSERT INTO skills SET ?', [{ user_id, skill }]);
    }

    resultSkills = await db.query('SELECT skill FROM skills WHERE ?', [
      { user_id },
    ]);

    newProfile.skills = Array.isArray(resultSkills)
      ? resultSkills.map(({ skill }) => skill)
      : [resultSkills.skill];

    const socialExist = await db.query('SELECT id FROM social WHERE ?', [
      { user_id },
    ]);
    if (socialExist) {
      social.id = socialExist.id;
    }

    newProfile.social = await db.query(
      'REPLACE INTO social SET ?; SELECT ?? FROM social WHERE ?',
      [social, select.social, { user_id }]
    );

    newProfile.social = newProfile.social || {};

    // cleanJson(newProfile);
    return res.status(statusCode).json(newProfile);
  } catch (err) {
    console.log('TCL: err', err);
    return res.status(500).json(new CustomError('Server Error'));
  }
});

// @route GET api/profile
// @desc Get all profiles
// @access Public
router.get('/', async (req, res) => {
  try {
    const profiles = await db.query('SELECT ?? FROM profile', [select.profile]);

    if (!profiles) {
      return res.status(404).json(new CustomError('No profiles found'));
    }

    const skills = await db.query('SELECT ?? FROM skills', [select.skills]);
    const social = await db.query('SELECT ?? FROM social', [select.social]);
    const experience = await db.query(
      'SELECT ?? FROM experience ORDER BY date_from DESC',
      [select.experience]
    );
    const education = await db.query(
      'SELECT ?? FROM education ORDER BY date_from DESC',
      [select.education]
    );
    const users = await db.query('SELECT id, name, avatar FROM users');

    profiles.forEach(profile => {
      const user_id = profile.user_id;
      profile.skills = skills
        .filter(skill => skill.user_id === user_id)
        .map(({ skill }) => skill);

      profile.user = users.filter(user => user.id === user_id)[0];

      const socialResult = social.filter(link => link.user_id === user_id)[0];

      profile.experience = experience.forEach(exp => {
        // find user_id and then hide it
        if (exp.user_id === user_id) {
          exp.user_id = null;
        }
      });

      profile.education = education.forEach(edu => {
        // find user_id and then hide it
        if (edu.user_id === user_id) {
          edu.user_id = null;
        }
      });

      socialResult.user_id = null;

      profile.social = socialResult;
      profile.user_id = null;
    });

    cleanJson(profiles);
    return res.status(200).json(profiles);
  } catch (err) {
    console.log(err);
    return res.status(500).json(new CustomError('Server Error'));
  }
});

// @route GET api/profile/user/:user_id
// @desc Get profile by user ID
// @access Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const profile = await db.query('SELECT ?? FROM profile WHERE ?', [
      select.profile,
      { user_id },
    ]);

    if (!profile) {
      return res.status(404).json(new CustomError('Profile not found'));
    }

    const user = await db.query('SELECT id, name, avatar FROM users WHERE ?', [
      { id: user_id },
    ]);
    const skills = await db.query('SELECT skill FROM skills WHERE ?', [
      { user_id },
    ]);
    const social = await db.query('SELECT ?? FROM social WHERE ?', [
      select.social,
      { user_id },
    ]);

    profile.social = social;
    profile.user = user;
    profile.skills = Array.isArray(skills)
      ? skills.map(({ skill }) => skill)
      : [skills.skill];

    cleanJson(profile);
    res.status(200).json(profile);
  } catch (err) {
    console.log(err);
    return res.status(500).json(new CustomError('Server Error'));
  }
});

// @route DELETE api/profile
// @desc delete profile, user & posts by user ID
// @access Private
router.delete('/', auth, async (req, res, next) => {
  try {
    const user_id = req.user.id;

    await db.query('DELETE FROM posts WHERE ?', [{ user_id }]);
    await db.query('DELETE FROM social WHERE ?', [{ user_id }]);
    await db.query('DELETE FROM skills WHERE ?', [{ user_id }]);
    await db.query('DELETE FROM profile WHERE ?', [{ user_id }]);
    await db.query('DELETE FROM users WHERE ?', [{ id: user_id }]);

    res.json({ msg: 'User removed' });
  } catch (err) {
    console.log(err);
    return res.status(500).json(new CustomError('Server Error'));
  }
});

// @route PUT api/profile/experience
// @desc Add profile experience
// @access Private
router.put('/experience', validate.experience, async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(new CustomError(errors.array()));
  }

  const {
    title,
    company,
    location,
    date_from,
    date_to,
    current,
    description,
  } = req.body;

  const experienceFields = {
    title,
    company,
    location,
    date_from,
    date_to,
    current,
    description,
  };

  cleanInput(experienceFields);
  const user_id = req.user.id;
  experienceFields.user_id = user_id;
  experienceFields.current = current === null ? 0 : current;

  try {
    const profile = await db.query('SELECT ?? FROM profile WHERE ?', [
      select.profile,
      { user_id },
    ]);

    if (!profile) {
      return res.status(404).json(new CustomError('Profile not found'));
    }

    profile.experience = await db.query(
      'INSERT INTO experience SET ?; SELECT ?? FROM experience WHERE ? ORDER BY date_from DESC',
      [experienceFields, select.experience, { user_id }]
    );

    const skills = await db.query('SELECT skill FROM skills WHERE ?', [
      { user_id },
    ]);
    const social = await db.query('SELECT ?? FROM social WHERE ?', [
      select.social,
      { user_id },
    ]);

    profile.social = social;
    profile.skills = Array.isArray(skills)
      ? skills.map(({ skill }) => skill)
      : [skills.skill];

    cleanJson(profile);
    return res.status(201).json(profile);
  } catch (err) {
    console.log(err);
    return res.status(500).json(new CustomError('Server Error'));
  }
});

// @route DELETE api/profile/experience/:exp_id
// @desc Delete profile experience
// @access Private
router.delete('/experience/:exp_id', auth, async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(new CustomError(errors.array()));
  }

  const exp_id = req.params.exp_id;
  const user_id = req.user.id;

  try {
    await db.query('DELETE FROM experience WHERE ? AND ?', [
      { id: exp_id },
      { user_id },
    ]);

    return res.status(200).json({ msg: 'Experience removed' });
  } catch (err) {
    console.log(err);
    return res.status(500).json(new CustomError('Server Error'));
  }
});

// @route PUT api/profile/education
// @desc  Add profile education
// @access Private
router.put('/education', validate.education, async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(new CustomError(errors.array()));
  }

  const {
    school,
    degree,
    fieldofstudy,
    date_from,
    date_to,
    current,
    description,
  } = req.body;

  const educationFields = {
    school,
    degree,
    fieldofstudy,
    date_from,
    date_to,
    current,
    description,
  };

  cleanInput(educationFields);

  const user_id = req.user.id;
  educationFields.user_id = user_id;
  educationFields.current = current === null ? 0 : current;

  try {
    const profile = await db.query('SELECT ?? FROM profile WHERE ?', [
      select.profile,
      { user_id },
    ]);

    if (!profile) {
      return res.status(404).json(new CustomError('Profile not found'));
    }

    profile.education = await db.query(
      'INSERT INTO education SET ?; SELECT ?? FROM education WHERE ? ORDER BY date_from DESC',
      [educationFields, select.education, { user_id }]
    );

    const skills = await db.query('SELECT skill FROM skills WHERE ?', [
      { user_id },
    ]);
    const social = await db.query('SELECT ?? FROM social WHERE ?', [
      select.social,
      { user_id },
    ]);

    profile.social = social;
    profile.skills = Array.isArray(skills)
      ? skills.map(({ skill }) => skill)
      : [skills.skill];

    cleanJson(profile);
    return res.status(201).json(profile);
  } catch (err) {
    console.log(err);
    return res.status(500).json(new CustomError('Server Error'));
  }
});

// @route DELETE api/profile/education/:edu_id
// @desc Delete profile education
// @access Private
router.delete('/education/:edu_id', auth, async (req, res, next) => {
  const edu_id = req.params.edu_id;
  const user_id = req.user.id;

  try {
    await db.query('DELETE FROM education WHERE ? AND ?', [
      { id: edu_id },
      { user_id },
    ]);

    return res.status(200).json({ msg: 'Education removed' });
  } catch (err) {
    console.log(err);
    return res.status(500).json(new CustomError('Server Error'));
  }
});

// @route GET api/profile/github/:username
// @desc GET github profile
// @access Public
router.get('/github/:username', async (req, res, next) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=create:asc&client_id=${config.get(
        'github.clientId'
      )}&client_secret=${config.get('github.secret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };

    request(options, (err, response, body) => {
      if (err) console.log(err);

      if (response.statusCode !== 200) {
        return res.status(404).json(new CustomError('No Github profile found'));
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(new CustomError('Server Error'));
  }
});

module.exports = router;
