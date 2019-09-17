const Schema = require('../schemas/index');

const Skills = new Schema('skills', {
  id: 'INT AUTO_INCREMENT',
  user_id: 'INT',
  profile_id: 'INT',
  skill: 'VARCHAR(100)',
  'PRIMARY KEY': '(id)',
  'FOREIGN KEY': '(user_id) REFERENCES users(id)',
  'FOREIGN KEY': '(profile_id) REFERENCES profile(id)',
});

module.exports = Skills;
