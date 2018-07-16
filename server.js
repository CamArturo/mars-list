const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);

app.use(bodyParser.json());
app.use(express.static("public"));
app.set("port", process.env.PORT || 3000);

app.get("/", (request, response) => {

});

app.get("/api/v1/items", (request, response) => {
  database("items").select()
    .then((items) => {
      response.status(200).json(items);
    })
    .catch((error) => {
      response.status(500).json({error});
    });
});

app.post("/api/v1/items", (request, response) => {
  const item = request.body;

  for (let requiredParameter of ["item_name"]) {
    if (!item[requiredParameter]) {
      return response
        .status(422)
        .send({error: `Expected format: { item_name: <String> }. You're missing a "${requiredParameter}" property.`});
    }
  }

  database("items").insert(item, "id")
    .then(item => {
      response.status(201).json({
        id: item[0]
      });
    })
    .catch(error => {
      response.status(500).json({error});
    });
});

app.delete('/api/v1/items/:itemId', (request, response) => {

  const id = request.params.itemId;

  database('items').where("id", id)
    .del()
    .then(item => {
      response.sendStatus(204);
    })
    .catch(error => {
      response.status(500).json({error});
    });
});

app.patch('/api/v1/items/:itemId', (request, response) => {
  const id = request.params.itemId;
  let updatedItem = request.body;
  updatedItem = {
    item_packed: updatedItem.value
  };

  database('items').where("id", id)
    .update(updatedItem)
    .then(item => {
      response.sendStatus(201);
    })
    .catch(error => {
      response.status(500).json({error});
    });
});

app.listen(app.get("port"), () => {
  console.log(`Running on ${app.get("port")}.`);
});