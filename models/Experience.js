const Schema = require('../schemas/index');

const Experience = new Schema('experience', {
  id: 'INT AUTO_INCREMENT',
  user_id: 'INT',
  profile_id: 'INT',
  title: 'VARCHAR(100) NOT NULL',
  company: 'VARCHAR(100) NOT NULL',
  location: 'VARCHAR(100) NOT NULL',
  date_from: 'DATE NOT NULL',
  date_to: 'DATE',
  current: 'TINYINT(1) DEFAULT 0',
  description: 'TEXT',
  'PRIMARY KEY': '(id)',
  'FOREIGN KEY': '(user_id) REFERENCES users(id)',
  'FOREIGN KEY': '(profile_id) REFERENCES profile(id)',
});

module.exports = Experience;
