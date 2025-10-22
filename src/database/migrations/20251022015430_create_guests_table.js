/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTableIfNotExists("guests", (table) => {
        table.increments("id").primary();
        table.string("primary_name", 35).notNullable();
        table.string("secondary_name", 35);
        table.string("phone", 20).notNullable().unique();
        table.boolean("status").defaultTo(false);
        table.timestamps(true, true);
    });
}


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable("guest");
}