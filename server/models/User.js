const db = require('../../config/db');

/**Strategies to save data
 *
 * active - Type boolean. When pulling data check if it's false.
 * All data should be kept in case user reactivates account
 *
 * deleted_at - Type null. When pulling data check if it's null.
 * When deleted, set it to current timestamp.
 * Make sure to set password and other sensitive data to null
 */

/** Why save data?
 *
 * Users accidently or regrettably delete data
 * Bad guys who gained users' account may delete data
 */
db.createTable(
  'users',
  `
  CREATE TABLE IF NOT EXISTS users(
    id INT AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    avatar VARCHAR(255),
    confirmed TINYINT(1) DEFAULT 0,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    # deleted_at NULL,
    PRIMARY KEY (id)
  ); SHOW WARNINGS;
`
);
