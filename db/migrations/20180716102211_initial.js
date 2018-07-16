exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('items', function(table) {
      table.increments('id').primary();
      table.string('item_name');
      table.boolean('item_packed');
      table.timestamps(true, true);
    })

    // knex.schema.createTable('packed', function(table) {
    //   table.increments('id').primary();
    //   table.boolean('packed');
    //   table.integer('item_id').unsigned();
    //   table.foreign('item_id').references('items.id');
    //
    //   table.timestamps(true, true);
    // })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    // knex.schema.dropTable('packed'),
    knex.schema.dropTable('items')
  ]);
};