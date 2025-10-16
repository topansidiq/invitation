/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('guests', table => {
        table.increments('id').primary;
        table.string('primary_name', 100).notNullable();
        table.string('secondary_name', 100).nullable();
        table.string('phone', 20).notNullable();
        table.boolean('status').defaultTo(false);
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTableIfExists('guests');
};
