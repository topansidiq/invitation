import dotenv from 'dotenv';
dotenv.config();

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
    },
    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: "./db/migrations"
        },
        pool: {
            min: 2,
            max: 10
        },
        ssl: {
            rejectUnauthorized: false
        }
    }
};