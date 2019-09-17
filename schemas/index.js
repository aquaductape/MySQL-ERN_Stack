const connection = require('../config/db');
const {
  parseKeysForInsert,
  parseValuesForInsert,
  parseKeysForSelect,
} = require('./utils/parse');
const createTable = require('./utils/createTable');

module.exports = class Schema {
  constructor(name, rows) {
    this.name = name;
    this.rows = rows;
    this.columnsForInsert = parseKeysForInsert(rows);
    this.columnsForSelect = parseKeysForSelect(rows);

    createTable(name, rows);
  }

  add(input) {
    const values = parseValuesForInsert(input);
    console.log('TCL: Schema -> add -> values', values);

    const queryString = `
      INSERT INTO ${this.name} (${this.columnsForInsert})
      VALUES
      (${values});
    `;

    return new Promise((resolve, reject) => {
      connection.query(queryString, (err, results, fields) => {
        if (err) reject(err);

        resolve(results);
      });
    });
  }

  findOne(select, opt = {}) {
    if (typeof select !== 'object') {
      throw new TypeError('Must be an object');
    }

    let columns = '*';

    if (!opt.filter) {
      opt.filter = [];
    } else {
      columns = this.columnsForSelect.filter(
        attr => !opt.filter.includes(attr)
      );

      if (columns.length === 0) {
        throw new Error('All columns filtered');
      }

      columns = columns.join(', ');
    }

    let queryString = `SELECT ${columns} FROM ${this.name} WHERE `;
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
  }

  findById(id, opt = {}) {
    let columns = '*';

    if (!opt.filter) {
      opt.filter = [];
    } else {
      columns = this.columnsForSelect.filter(
        attr => !opt.filter.includes(attr)
      );

      if (columns.length === 0) {
        throw new Error('All columns filtered');
      }

      columns = columns.join(', ');
    }

    const queryString = `SELECT ${columns} FROM users WHERE id = ${id}`;

    return new Promise((resolve, reject) => {
      connection.query(queryString, (err, results, fields) => {
        if (err) {
          reject(err);
        } else {
          if (results.length === 0) {
            resolve(null);
          }
          // mysql returns rows ie arrays in this case
          resolve(results[0]);
        }
      });
    });
  }

  update() {}
  getAll() {}
};
