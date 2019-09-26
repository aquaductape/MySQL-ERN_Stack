const db = require('../../config/db');

db.createTable(
  'social',
  `
  CREATE TABLE IF NOT EXISTS social(
    id INT AUTO_INCREMENT,
    user_id INT,
    youtube VARCHAR(255),
    twitter VARCHAR(255),
    facebook VARCHAR(255),
    linkedin VARCHAR(255),
    instagram VARCHAR(255),
    # deleted_at NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  ); SHOW WARNINGS;
`
);
