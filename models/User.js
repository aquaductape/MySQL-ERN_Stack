const connection = require('../config/db');
const { USER_COLUMNS } = require('./columns');

const getAll = id => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM users', (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
};

const findById = (id, opt = {}) => {
  let columns = '*';

  if (!opt.filter) {
    opt.filter = [];
  } else {
    columns = USER_COLUMNS.filter(attr => !opt.filter.includes(attr));
    columns = columns.length === 1 ? '' : columns.join(', ');
  }

  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT ${columns} FROM users WHERE id = ${id}`,
      (err, results, fields) => {
        if (err) {
          reject(err);
        } else {
          if (results.length === 0) {
            resolve(null);
          }
          // mysql returns rows ie arrays in this case
          resolve(results[0]);
        }
      }
    );
  });
};

const findOne = (select, opt = {}) => {
  if (typeof select !== 'object') {
    throw new TypeError('Must be an object');
  }

  let columns = '*';

  if (!opt.filter) {
    opt.filter = [];
  } else {
    columns = USER_COLUMNS.filter(attr => !opt.filter.includes(attr));
    columns = columns.length === 1 ? '' : columns.join(', ');
  }

  let queryString = `SELECT ${columns} FROM users WHERE `;
  queryString += Object.entries(select)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' AND ');

  return new Promise((resolve, reject) => {
    connection.query(queryString, (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        if (results.length === 0) {
          resolve(null);
        }

        resolve(results[0]);
      }
    });
  });
};

const add = ({ name, email, password, avatar }) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `
      INSERT INTO users (name, email, password, avatar, date) 
      VALUES
      ("${name}", "${email}", "${password}", "${avatar}", now());
    `,
      (err, results, fields) => {
        if (err) reject(err);

        resolve(results);
      }
    );
  });
};

const update = (id, user) => {
  return new Promise((resolve, reject) => {
    connection.query();
  });
};

const remove = id => {
  return new Promise((resolve, reject) => {
    connection.query('', (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = userModel = {
  getAll,
  add,
  update,
  remove,
  findById,
  findOne,
};
