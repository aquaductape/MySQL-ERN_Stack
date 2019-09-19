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
  const reserved = ['PRIMARY KEY', 'FOREIGN KEY'];
  return Object.keys(obj).filter(key => !reserved.includes(key));
};

const parsePropertiesForSet = obj => {
  return Object.entries(obj)
    .map(([key, value]) => {
      if (value === undefined) {
        return null;
      }

      if (typeof value === 'number') {
        return `${key}=${value}`;
      }
      return `${key}='${value}'`;
    })
    .filter(el => el !== null)
    .join(', ');
};

const parsePropertiesForWhere = obj => {
  return Object.entries(obj)
    .map(([key, value]) => {
      if (typeof value === 'number') {
        return `${key}=${value}`;
      }

      return `${key}='${value}'`;
    })
    .join(' AND ');
};

const parseBlockEmptyStringForTrigger = obj => {
  return Object.entries(obj)
    .map(([key, value]) => {
      if (value.match(/not\snull/gi)) {
        return `
      IF NEW.${key} = '' THEN
        SET  NEW.${key} = NULL;
      END IF;
      `;
      }

      return null;
    })
    .filter(el => el)
    .join('\n');
};

module.exports = {
  parseRows,
  parseValuesForInsert,
  parseKeysForInsert,
  parseKeysForSelect,
  parseBlockEmptyStringForTrigger,
  parsePropertiesForSet,
  parsePropertiesForWhere,
};
