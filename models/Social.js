const Schema = require('../schemas/index');

const Social = new Schema('social', {
  id: 'INT AUTO_INCREMENT',
  user_id: 'INT NOT NULL',
  profile_id: 'INT NOT NULL',
  youtube: 'VARCHAR(255)',
  twitter: 'VARCHAR(255)',
  facebook: 'VARCHAR(255)',
  linkedin: 'VARCHAR(255)',
  instagram: 'VARCHAR(255)',
  'PRIMARY KEY': '(id)',
  'FOREIGN KEY': '(user_id) REFERENCES users(id)',
  'FOREIGN KEY': '(profile_id) REFERENCES profile(id)',
});

module.exports = Social;
