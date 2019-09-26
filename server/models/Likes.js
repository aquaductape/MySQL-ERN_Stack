const db = require('../../config/db');

db.createTable(
  'likes',
  `
  CREATE TABLE IF NOT EXISTS likes(
    id INT AUTO_INCREMENT,
    user_id INT ,
    post_id INT,
    name VARCHAR(100) NOT NULL,
    avatar VARCHAR(255),
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    # deleted_at NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE SET NULL
  ); SHOW WARNINGS;
`
);
