exports.up = function(knex) {
    return knex.schema.createTable('smk', table => {
        table.integer('user_id')
            .notNullable()
            .references('id')
            .inTable('users');
        table.integer('timestamp').notNullable();
        table.integer('bolador').notNullable();
        table.integer('sanguessuga').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('smk');
}