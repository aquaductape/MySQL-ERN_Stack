const config = require('config');
const mysql = require('mysql');

const User = require('../server/models/user/User');
const Account = require('../server/models/user/Account');
const Profile = require('../server/models/profile/Profile');
const Skills = require('../server/models/profile/Skills');
const Social = require('../server/models/profile/Social');
const Experience = require('../server/models/profile/Experience');
const Education = require('../server/models/profile/Education');
const Comments = require('../server/models/post/Comments');
const Likes = require('../server/models/post/Likes');
const Post = require('../server/models/post/Post');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: config.get('db.host'),
  port: config.get('db.port'),
  user: config.get('db.user'),
  password: config.get('db.password'),
  database: config.get('db.database'),
  multipleStatements: true,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.log(err);
    throw err;
  }
  console.log('MySQL connected... 🐬 ');
  // Create tables
  createTable(connection, ...User);
  // createTable(connection, ...Account);
  createTable(connection, ...Profile);
  createTable(connection, ...Skills);
  createTable(connection, ...Social);
  createTable(connection, ...Education);
  createTable(connection, ...Experience);
  createTable(connection, ...Post);
  createTable(connection, ...Likes);
  createTable(connection, ...Comments);

  connection.release();
});

class Database {
  constructor(pool) {
    this.pool = pool;
  }
  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) return reject(err);

        connection.query(sql, args, (err, rows, fields) => {
          connection.release();
          if (err) return reject(err);

          // If query to select all columns from a table then return as an array
          // If query is modifying
          if (!sql.match(/where/gi)) {
            resolve(rows);
          }
          // If query is to pick a column, return null if it doesn't exist
          if (rows.length === 0) {
            resolve(null);
          }

          if (rows.length > 1) {
            // If rows contains an OkPacket, get the second item which contains rows
            // this is usefull when selecting the column after modifying it
            if (rows[0].constructor.name === 'OkPacket') {
              resolve(rows[1]);
            }
            resolve(rows);
          }

          if (rows.length) {
            resolve(rows[0]);
          }
          resolve(rows);
        });
      });
    });
  }

  createTrigger() {
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
  }
}

function createTable(connection, name, sql, args) {
  const tableExist = rows => {
    for (let row of rows) {
      if (row.Code === 1050) return true;
      if (Array.isArray(row)) return tableExist(row);
    }
  };
  connection.query(sql, args, (err, rows) => {
    // console.log('TCL: Database -> createTable -> rows', rows);
    // console.log('ran');
    // connection.release();
    if (err) {
      console.log(err);
      throw err;
    }
    if (!tableExist(rows)) {
      console.log(`Created ${name} TABLE`);
    }
  });
}

module.exports = db = new Database(pool);
