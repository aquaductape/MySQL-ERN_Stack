module.exports = [
  'comments',
  `
  CREATE TABLE IF NOT EXISTS comments(
    id INT AUTO_INCREMENT,
    user_id INT,
    post_id INT,
    name VARCHAR(100) NOT NULL,
    avatar VARCHAR(255),
    text TEXT NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE SET NULL
  ); SHOW WARNINGS;
`,
];
