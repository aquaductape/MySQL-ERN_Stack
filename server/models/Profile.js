const db = require('../../config/db');

db.createTable(
  'profile',
  `
  CREATE TABLE IF NOT EXISTS profile(
    id INT AUTO_INCREMENT,
    user_id INT,
    company VARCHAR(100),
    website VARCHAR(100),
    location VARCHAR(100),
    status VARCHAR(100) NOT NULL,
    bio TEXT,
    githubusername VARCHAR(100),
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    # deleted_at NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  ); SHOW WARNINGS;
`
);
