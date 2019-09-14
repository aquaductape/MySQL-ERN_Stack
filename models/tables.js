const COLUMNS = require('./columns').USER_COLUMNS;

const createUsers = db => {
  return new Promise((resolve, reject) => {
    db.query(
      `
      CREATE TABLE IF NOT EXISTS users(
         ${COLUMNS[0]} INT AUTO_INCREMENT,
         ${COLUMNS[1]} VARCHAR(100) NOT NULL,
         ${COLUMNS[2]} VARCHAR(50) NOT NULL UNIQUE,
         ${COLUMNS[3]} VARCHAR(100) NOT NULL,
         ${COLUMNS[4]} VARCHAR(255),
         ${COLUMNS[5]} DATETIME,
         PRIMARY KEY(id)
      ); SHOW WARNINGS;
    `,
      (error, rows, fields) => {
        if (error) {
          reject(error);
        } else {
          rows = JSON.parse(JSON.stringify(rows));

          // automaticaly create tables if they don't exist
          if (!(rows[1][0] && rows[1][0].Code === 1050)) {
            console.log('Created users TABLE');
          }
          resolve(rows);
        }
      }
    );
  });
};

module.exports = {
  createUsers,
};
