const config = require('config');
const mysql = require('mysql');

const connection = mysql.createPool({
  connectionLimit: 10,
  host: config.get('db.host'),
  port: config.get('db.port'),
  user: config.get('db.user'),
  password: config.get('db.password'),
  database: config.get('db.database'),
  multipleStatements: true,
});

connection.getConnection(async err => {
  if (err) {
    console.log(err);
    return err;
  }

  console.log('Connected to mysql 🐬 ');
});

module.exports = connection;
