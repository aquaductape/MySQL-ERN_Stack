const connection = require('../../config/db');

const { parseBlockEmptyStringForTrigger } = require('./parse');

module.exports = createTrigger = (name, type, rows) => {
  const triggerName = `block_empty_string_on_insert_for_${name}`;

  const blockEmptyString = parseBlockEmptyStringForTrigger(rows);

  if (!blockEmptyString.length) {
    return null;
  }

  // Mysql: ...if you use the mysql program to define a trigger that executes multiple statements, it is necessary to redefine the mysql statement DELIMITER so that you can use the ; statement DELIMITER within the trigger definition.

  // this mysql nodejs driver is throwing syntax errors by using DELIMITER, probably because multiple queries are enabled, therefore DELIMITERs are not included
  const queryString = `
        DROP TRIGGER IF EXISTS ${triggerName};
        CREATE TRIGGER ${triggerName}
        BEFORE ${type} ON ${name} FOR EACH ROW
        BEGIN
          ${blockEmptyString}
        END;
        `;

  return new Promise((resolve, reject) => {
    connection.query(queryString, (err, results, fields) => {
      if (err) {
        console.log('TCL: err', err);
        reject(err);
      } else {
        results = JSON.parse(JSON.stringify(results));

        console.log(`Removed then created ${triggerName} TRIGGER for ${type}`);
        resolve(results);
      }
    });
  });
};
