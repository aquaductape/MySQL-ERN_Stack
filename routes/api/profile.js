const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const Skills = require('../../models/Skills');
const Social = require('../../models/Social');
const Education = require('../../models/Education');
const Experience = require('../../models/Experience');
const auth = require('../../middleware/auth');
const CustomError = require('../../helpers/CustomError');
const validateProfile = require('../../middleware/validateProfile');

const addPropertyIfObj = (obj, property) => {
  const entries = Object.entries(property);
  if (obj != null && !Array.isArray(obj)) {
    entries.forEach(([key, value]) => {
      obj[key] = value;
    });
  }
};

const clean = obj => {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && obj[key] != null) clean(obj[key]);
    else obj[key] == null && delete obj[key];
  });

  return obj;
};

// @route GET api/me
// @desc Get personal profile
// @access private
router.get('/me', auth, async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const opt = {
      select: `
        profile.*,
        skills.*
      `,
      innerJoin: `
      INNER JOIN skills
      ON profile.id = skills.profile_id
    `,
    };

    const profile = await Profile.findOne({ user_id });

    if (!profile) {
      return res
        .status(400)
        .json(new CustomError('There is no profile for this user'));
    }
    const skills = (await Skills.findOne({ user_id }, { select: 'skill' })).map(
      ({ skill }) => skill
    );
    profile.skills = skills || [];

    const education = await Education.findOne(
      { user_id },
      { filter: ['id', 'profile_id', 'user_id'] }
    );
    profile.education = education || [];

    const experience = await Experience.findOne(
      { user_id },
      { filter: ['id', 'profile_id', 'user_id'] }
    );
    profile.experience = experience || [];

    const social = await Social.findOne(
      { user_id },
      {
        filter: ['id', 'profile_id', 'user_id'],
      }
    );
    profile.social = social || {};

    res.status(200).json(clean(profile));
  } catch (err) {
    console.log('TCL: err', err);
    res.status(400).json(new CustomError('Server Error'));
  }
});

// @route POST api/
// @desc Create or update personal profile
// @access private
router.post('/', validateProfile, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(new CustomError(errors.array()));
  }

  const {
    status,
    company,
    website,
    location,
    bio,
    skills,
    education,
    experience,
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
  clean(social);

  const user_id = req.user.id;
  profileFields.user_id = user_id;

  try {
    const profileExist = await Profile.findOne({ user_id });

    if (profileExist) {
      const profile_id = profileExist.id;
      const updatedProfile = await Profile.update({ user_id }, profileFields, {
        selectBy: { user_id },
      });

      addPropertyIfObj(skills, { user_id, profile_id });
      addPropertyIfObj(experience, { user_id, profile_id });
      addPropertyIfObj(education, { user_id, profile_id });
      addPropertyIfObj(social, { user_id, profile_id });

      const skillsArr = skills.split(/\,\s*/).filter(skill => skill);

      await Skills.delete({ profile_id });

      for (let skill of skillsArr) {
        await Skills.add({ user_id, profile_id, skill });
      }

      resultSkills = await Skills.findOne({ user_id }, { select: 'skill' });

      updatedProfile.skills = Array.isArray(resultSkills)
        ? resultSkills.map(({ skill }) => skill)
        : [resultSkills.skill];

      if (education) {
        updatedProfile.education = await Education.update(
          { profile_id },
          education,
          { selectBy: profile_id }
        );
      }

      if (experience) {
        updatedProfile.experience = await Experience.update(
          { profile_id },
          experience,
          { selectBy: profile_id }
        );
      }

      if (Object.keys(social).length) {
        socialExist = await Social.findOne({ profile_id });

        if (!socialExist) {
          updatedProfile.social = await Social.add(social, {
            selectBy: { profile_id },
            filter: ['id', 'user_id', 'profile_id'],
          });
        } else {
          updatedProfile.social = await Social.update({ profile_id }, social, {
            selectBy: { profile_id },
            filter: ['id', 'user_id', 'profile_id'],
          });
        }
      }

      updatedProfile.education = updatedProfile.education || [];
      updatedProfile.experience = updatedProfile.experience || [];
      updatedProfile.social = updatedProfile.social || {};

      return res.status(200).json(clean(updatedProfile));
    }

    const newProfile = await Profile.add(profileFields, {
      selectBy: { user_id },
    });
    const profile_id = newProfile.id;
    addPropertyIfObj(skills, { user_id, profile_id });
    addPropertyIfObj(experience, { user_id, profile_id });
    addPropertyIfObj(education, { user_id, profile_id });
    addPropertyIfObj(social, { user_id, profile_id });

    const skillsArr = skills.split(/\,\s*/).filter(skill => skill);

    for (let skill of skillsArr) {
      await Skills.add({ user_id, profile_id, skill });
    }

    resultSkills = await Skills.findOne({ user_id }, { select: 'skill' });

    newProfile.skills = Array.isArray(resultSkills)
      ? resultSkills.map(({ skill }) => skill)
      : [resultSkills.skill];

    if (education) {
      newProfile.education = await Education.add(education, {
        selectBy: { user_id },
        filter: ['id', 'user_id', 'profile_id'],
      });
    }
    if (experience) {
      newProfile.experience = await Experience.add(experience, {
        selectBy: { user_id },
        filter: ['id', 'user_id', 'profile_id'],
      });
    }
    if (Object.keys(social).length) {
      newProfile.social = await Experience.add(social, {
        selectBy: { user_id },
        filter: ['id', 'user_id', 'profile_id'],
      });
    }

    newProfile.education = newProfile.education || [];
    newProfile.experience = newProfile.experience || [];
    newProfile.social = newProfile.social || {};

    return res.status(201).json(clean(newProfile));
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
    const profiles = await Profile.getAll();
    const skills = await Skills.getAll();
    profiles.forEach(profile => {
      profile.skills = skills
        .filter(skill => skill.user_id === profile.user_id)
        .map(({ skill }) => skill);

      delete profile.id;
      delete profile.user_id;
    });

    return res.status(200).json(clean(profiles));
  } catch (err) {
    console.log(err);
    return res.status(500).json(new CustomError('Server Error'));
  }
});
module.exports = router;
