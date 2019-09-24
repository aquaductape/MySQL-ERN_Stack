const db = require('../config/db');

db.createTable(
  'comments',
  `
  CREATE TABLE IF NOT EXISTS comments(
    id INT AUTO_INCREMENT,
    user_id INT,
    post_id INT,
    text TEXT NOT NULL,
    name VARCHAR(100),
    avatar VARCHAR(255),
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE SET NULL
  ); SHOW WARNINGS;
`
);
