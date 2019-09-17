const Schema = require('../schemas/index');

const User = new Schema('users', {
  id: 'INT AUTO_INCREMENT',
  name: 'VARCHAR(100) NOT NULL',
  email: 'VARCHAR(100) NOT NULL UNIQUE',
  password: 'VARCHAR(100) NOT NULL',
  avatar: 'VARCHAR(255)',
  date: 'DATETIME',
  'PRIMARY KEY': '(id)',
});

module.exports = User;
