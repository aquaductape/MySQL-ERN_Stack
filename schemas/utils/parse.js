const parseRows = obj => {
  const entries = Object.entries(obj);

  return entries
    .map(([key, value], idx) => {
      if (entries.length - 1 === idx) {
        return `${key} ${value}`;
      }

      return `${key} ${value},`;
    })
    .join('\n');
};

const parseKeysForInsert = obj => {
  const reserved = ['id', 'PRIMARY KEY', 'FOREIGNE KEY'];
  return Object.keys(obj)
    .filter(key => !reserved.includes(key))
    .join(', ');
};

const parseValuesForInsert = obj => {
  return Object.values(obj)
    .map(key => {
      if (key == null) {
        return 'NULL';
      }

      if (typeof key === 'number' || key.match(/.*\(\)$/)) {
        return key;
      }

      return `'${key}'`;
    })
    .join(', ');
};

const parseKeysForSelect = obj => {
  const reserved = ['PRIMARY KEY', 'FOREIGNE KEY'];
  return Object.keys(obj).filter(key => !reserved.includes(key));
};

module.exports = {
  parseRows,
  parseValuesForInsert,
  parseKeysForInsert,
  parseKeysForSelect,
};
