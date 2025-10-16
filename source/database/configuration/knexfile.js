// source/database/configuration/knexfile.js
export default {
  development: {
    client: 'sqlite3',
    connection: {
      filename: '../sql/database.sqlite',

    },
    useNullAsDefault: true,
    migrations: {
      directory: '../migrations'
    },
    seeds: {
      directory: '../seeds'
    }
  }
};
