const Schema = require('../schemas/index');

const Profile = new Schema('profile', {
  id: 'INT AUTO_INCREMENT',
  user_id: 'INT',
  company: 'VARCHAR(100)',
  website: 'VARCHAR(100)',
  location: 'VARCHAR(100)',
  status: 'VARCHAR(100) NOT NULL',
  bio: 'TEXT',
  githubusername: 'VARCHAR(100)',
  date: 'DATETIME DEFAULT CURRENT_TIMESTAMP',
  'PRIMARY KEY': '(id)',
  'FOREIGN KEY': '(user_id) REFERENCES users(id)',
});

module.exports = Profile;
