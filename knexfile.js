export default {
    development: {
        client: 'sqlite3',
        connection: {
            filename: "./data/db.sqlite"
        },
        useNullAsDefault: true,
        migrations: {
            directory: "./db/migrations"
        }
    }
};