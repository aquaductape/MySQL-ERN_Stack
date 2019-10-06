module.exports = [
  'skills',
  `
  CREATE TABLE IF NOT EXISTS skills(
    id INT AUTO_INCREMENT,
    user_id INT,
    skill VARCHAR(100) NOT NULL,
    deleted_at DATETIME DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  ); SHOW WARNINGS;
`,
];
