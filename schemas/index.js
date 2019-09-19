const connection = require('../config/db');
const {
  parseKeysForInsert,
  parseValuesForInsert,
  parseKeysForSelect,
  parsePropertiesForSet,
  parsePropertiesForWhere,
} = require('./utils/parse');
const createTable = require('./utils/createTable');
const createTrigger = require('./utils/createTrigger');

module.exports = class Schema {
  constructor(name, rows) {
    this.name = name;
    this.rows = rows;
    this.keysForSelect = parseKeysForSelect(rows);
    createTable(name, rows);
    // createTrigger(name, 'INSERT', rows);
    // createTrigger(name, 'UPDATE', rows);
  }

  findOne(select, opt = {}) {
    // properties of opt
    // filter -> filter out columns
    // innerJoin -> use mysql syntax for input
    // select -> use mysql syntax for input to select particular fields
    // have -> filter out entire row if specified column is null

    if (typeof select !== 'object') {
      throw new TypeError('Must be an object');
    }

    let keys = opt.select || '*';

    if (!opt.filter) {
      opt.filter = [];
    } else {
      keys = this.keysForSelect.filter(attr => !opt.filter.includes(attr));

      if (keys.length === 0) {
        throw new Error('All columns filtered');
      }

      keys = keys.join(', ');
    }

    const innerJoin = opt.innerJoin || '';
    const having = opt.having || '';
    const where = parsePropertiesForWhere(select);

    let queryString = `SELECT ${keys} FROM ${this.name} ${innerJoin} WHERE ${where} ${having}`;

    return new Promise((resolve, reject) => {
      connection.query(queryString, (err, results, fields) => {
        if (err) return reject(err);

        if (results.length === 0) {
          resolve(null);
        }
        if (results.length > 1) {
          resolve(results);
        }

        resolve(results[0]);
      });
    });
  }

  getAll(opt = {}) {
    // properties of opt
    // filter -> filter out columns

    let selection = opt.select || '*';

    if (!opt.filter) {
      opt.filter = [];
    } else {
      selection = this.keysForSelect.filter(attr => !opt.filter.includes(attr));

      if (selection.length === 0) {
        throw new Error('All columns filtered');
      }

      selection = selection.join(', ');
    }

    const queryString = `SELECT ${selection} FROM ${this.name}`;

    return new Promise((resolve, reject) => {
      connection.query(queryString, (err, results, fields) => {
        if (err) return reject(err);

        if (results.length === 0) {
          resolve(null);
        }
        if (results.length > 1) {
          resolve(results);
        }

        // keep single item as array
        resolve(results);
      });
    });
  }

  add(input, opt = {}) {
    // properties of opt
    // select -> use mysql syntax for input to select particular fields
    // selectBy -> select row by specific column after a query

    const keys = parseKeysForInsert(input);
    if (!keys.length) {
      throw new Error('Input is empty');
    }

    let selection = '*';

    if (!opt.filter) {
      opt.filter = [];
    } else {
      selection = this.keysForSelect.filter(attr => !opt.filter.includes(attr));

      if (selection.length === 0) {
        throw new Error('All columns filtered');
      }

      selection = selection.join(', ');
    }

    const values = parseValuesForInsert(input);
    let postSelect = opt.select || '';

    if (opt.selectBy) {
      const where = parsePropertiesForWhere(opt.selectBy);
      postSelect = `SELECT ${selection} FROM ${this.name} WHERE ${where};`;
    }

    const queryString = `
      INSERT INTO ${this.name} (${keys})
      VALUES
      (${values});
      ${postSelect}
    `;

    return new Promise((resolve, reject) => {
      connection.query(queryString, (err, results, fields) => {
        if (err) return reject(err);

        if (opt.selectBy) {
          resolve(results[1][0]);
        }
        resolve(results);
      });
    });
  }

  update(select, input, opt = {}) {
    // properties of opt
    // select -> use mysql syntax for input to select particular fields
    // selectBy -> select row by specific column after a query
    if (typeof select !== 'object') {
      throw new TypeError('Must be an object');
    }

    let keys = '*';

    if (!opt.filter) {
      opt.filter = [];
    } else {
      keys = this.keysForSelect.filter(attr => !opt.filter.includes(attr));

      if (keys.length === 0) {
        throw new Error('All columns filtered');
      }

      keys = keys.join(', ');
    }

    const columns = parsePropertiesForSet(input);

    if (!columns.length) {
      throw new Error('Input is empty');
    }

    let postSelect = opt.select || '';

    if (opt.selectBy) {
      const where = parsePropertiesForWhere(opt.selectBy);
      postSelect = `SELECT ${keys} FROM ${this.name} WHERE ${where};`;
    }

    const where = parsePropertiesForWhere(select);

    const queryString = `UPDATE ${this.name} SET ${columns} WHERE ${where}; ${postSelect}`;

    return new Promise((resolve, reject) => {
      connection.query(queryString, (err, results, fields) => {
        if (err) return reject(err);

        if (results.length === 0) {
          resolve(null);
        }

        if (results.length > 1) {
          if (opt.selectBy) {
            resolve(results[1][0]);
          }
          resolve(results);
        }
        // mysql returns rows ie arrays in this case
        resolve(results[0]);
      });
    });
  }

  delete(select) {
    if (typeof select !== 'object') {
      throw new TypeError('Must be an object');
    }

    let queryString = `DELETE FROM ${this.name} WHERE `;
    queryString += parsePropertiesForWhere(select);

    return new Promise((resolve, reject) => {
      connection.query(queryString, (err, results, fields) => {
        if (err) return reject(err);

        if (results.length === 0) {
          resolve(null);
        }
        // mysql returns rows ie arrays in this case
        resolve(results[0]);
      });
    });
  }
};
