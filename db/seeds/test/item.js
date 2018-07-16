exports.seed = function (knex, Promise) {
  return knex("items").del()
    .then(() => {
      return Promise.all([
        knex("items").insert(
          {
            item_name: "item1Name",
            item_packed: true
          },
          "id"
        )
          .then(() => console.log("Seeding complete!"))
          .catch(error => console.log(`Error seeding data: ${error}`))
      ]);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};

