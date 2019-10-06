module.exports = [
  'experience',
  `
  CREATE TABLE IF NOT EXISTS experience(
    id INT AUTO_INCREMENT,
    user_id INT,
    title VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    date_from DATE NOT NULL,
    date_to DATE,
    current TINYINT(1) DEFAULT 0,
    description TEXT,
    deleted_at DATETIME DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)  
  ); SHOW WARNINGS;
`,
];
