// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
import dotenv from "dotenv";
dotenv.config();

export default {
    development: {
        client: "pg",
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: "./src/database/migrations",
        },
        seeds: {
            directory: "./src/database/seeds",
        },
    },
    production: {
        client: "pg",
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: "./src/database/migrations",
        },
        seeds: {
            directory: "./src/database/seeds",
        },
    },
};
