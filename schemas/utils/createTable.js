const connection = require('../../config/db');
const { parseRows } = require('./parse');

module.exports = createTable = (name, rows) => {
  rows = parseRows(rows);
  const queryString = `
        CREATE TABLE IF NOT EXISTS ${name}(
          ${rows}
        ); SHOW WARNINGS;
        `;

  return new Promise((resolve, reject) => {
    connection.query(queryString, (err, results, fields) => {
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
    });
  });
};
