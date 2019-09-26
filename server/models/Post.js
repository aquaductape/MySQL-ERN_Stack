const db = require('../../config/db');

db.createTable(
  'posts',
  `
  CREATE TABLE IF NOT EXISTS posts(
    id INT AUTO_INCREMENT,
    user_id INT,
    text TEXT NOT NULL,
    name VARCHAR(100),
    avatar VARCHAR(255),
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    # deleted_at NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL  
  ); SHOW WARNINGS;
`
);
