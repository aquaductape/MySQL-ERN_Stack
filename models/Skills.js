const db = require('../config/db');

db.createTable(
  'skills',
  `
  CREATE TABLE IF NOT EXISTS skills(
    id INT AUTO_INCREMENT,
    user_id INT,
    skill VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  ); SHOW WARNINGS;
`
);
