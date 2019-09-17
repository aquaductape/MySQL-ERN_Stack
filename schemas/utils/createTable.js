const connection = require('../config/db');
const { parseRows } = require('./utils/parse');

module.exports = createTable = (name, rows) => {
  const queryString = parseRows(rows);

  return new Promise((resolve, reject) => {
    connection.query(
      `
        CREATE TABLE IF NOT EXISTS ${name}(
          ${queryString}
        ); SHOW WARNINGS;
        `,
      (err, results, fields) => {
        if (err) {
          reject(err);
        } else {
          results = JSON.parse(JSON.stringify(results));

          // automaticaly create tables if they don't exist
          if (!(results[1][0] && results[1][0].Code === 1050)) {
            console.log(`Created ${name} TABLE`);
          }
          resolve(results);
        }
      }
    );
  });
};
