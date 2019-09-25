const db = require('../config/db');

db.createTable(
  'education',
  `
  CREATE TABLE IF NOT EXISTS education(
    id INT AUTO_INCREMENT,
    user_id INT,
    school VARCHAR(100) NOT NULL,
    degree VARCHAR(100) NOT NULL,
    fieldofstudy VARCHAR(100) NOT NULL,
    date_from DATE NOT NULL,
    date_to DATE,
    current TINYINT(1) DEFAULT 0,
    description TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)  
  ); SHOW WARNINGS;
`
);