const db = require('../config/db');

db.createTable(
  'users',
  `
  CREATE TABLE IF NOT EXISTS users(
    id INT AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    avatar VARCHAR(255),
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
  ); SHOW WARNINGS;
`
);
