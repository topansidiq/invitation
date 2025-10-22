import knex from "knex";
import config from '../../knexfile.js';

const environment = process.env.ENVIRONMENT || 'development';
export const database = knex(config.development);