/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('guests', table => {
        table.increments('id').primary();
        table.string('primary_name').notNullable();
        table.string('secondary_name');
        table.string('phone').notNullable();
        table.boolean('status').defaultTo(false);
        table.timestamps(true, true);
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable('guests');
}