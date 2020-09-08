exports.up = function(knex) {
    return knex.schema.createTable('userid_token', table => {
        table.integer('user_id')
            .notNullable()
            .references('id')
            .inTable('users');
        table.integer('token').notNullable()
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('userid_token');
}