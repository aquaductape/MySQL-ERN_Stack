module.exports = [
  'account',
  `
    CREATE TABLE IF NOT EXISTS account(
    id INT AUTO_INCREMENT,
    user_id INT,
    facebook_email VARCHAR(100),
    google_email VARCHAR(100),
    github_email VARCHAR(100),
    gitlab_email VARCHAR(100),
    facebook_id VARCHAR(100),
    google_id VARCHAR(100),
    github_id VARCHAR(100),
    gitlab_id VARCHAR(100),
    deleted_at DATETIME DEFAULT NULL,
    PRIMARY KEY (id)
    FOREIGN KEY (user_id) REFERENCES users(id)
  ); SHOW WARNINGS;
`,
];
