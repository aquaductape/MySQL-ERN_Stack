const config = require('config');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: config.get('db.host'),
  port: config.get('db.port'),
  user: config.get('db.user'),
  password: config.get('db.password'),
  database: config.get('db.database'),
  multipleStatements: true,
});

connection.connect(err => {
  if (err) {
    console.log(err);
    return err;
  }

  console.log('Connected to mysql 🐬 ');
});

connection.query(
  `DROP DATABASE IF EXISTS ${config.get('db.database')}`,
  (err, results, fields) => {
    if (err) {
      console.log(err);
      return err;
    }

    console.log('TCL: results', results);
    return results;
  }
);

connection.query(
  `CREATE DATABASE ${config.get('db.database')}`,
  (err, results, fields) => {
    if (err) {
      console.log(err);
      return err;
    }

    console.log('TCL: results', results);
    return results;
  }
);

connection.end();
