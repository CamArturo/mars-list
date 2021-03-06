process.env.NODE_ENV = "test";

const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../server");
const knex = require("../db/knex");

chai.use(chaiHttp);

describe("Client Routes", () => {
  beforeEach(function (done) {
    knex.migrate.rollback()
      .then(function () {
        knex.migrate.latest()
          .then(function () {
            return knex.seed.run()
              .then(function () {
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    knex.migrate.rollback()
      .then(function () {
        done();
      });
  });

  it("should return the homepage with text", done => {
    chai.request(server)
      .get("/")
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.html;
        done();
      });
  });
  it("should return a 404 for a route that does not exist", done => {
    chai.request(server)
      .get("/sad")
      .end((err, response) => {
        response.should.have.status(404);
        done();
      });
  });
});

describe("API Routes", () => {
  beforeEach(function (done) {
    knex.migrate.rollback()
      .then(function () {
        knex.migrate.latest()
          .then(function () {
            return knex.seed.run()
              .then(function () {
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    knex.migrate.rollback()
      .then(function () {
        done();
      });
  });

  describe("GET /api/v1/items", () => {
    it("should return all of the items with correct column names", done => {
      chai.request(server)
        .get("/api/v1/items")
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a("array");
          response.body[0].should.be.a("object");
          response.body[0].should.have.property("id");
          response.body[0].id.should.be.a("number");
          response.body[0].should.have.property("item_name");
          response.body[0].item_name.should.be.a("string");
          response.body[0].item_name.should.equal('item1Name');
          response.body[0].should.have.property("item_packed");
          response.body[0].item_packed.should.be.a("boolean");
          response.body[0].item_packed.should.equal(true);
          done();
        });
    });
  });
  describe("POST /api/v1/items", () => {
    it("should add an item to db", done => {
      chai.request(server)
        .post("/api/v1/items")
        .send({
          item_name: "newItem!",
          item_packed: true
        })
        .end((err, response) => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a("object");
          response.body.should.have.property("id");
          response.body.id.should.be.a("number");
          done();
        });
    });
    it("should return a 422 if item_name is not included in the body", done => {
      chai.request(server)
        .post("/api/v1/items")
        .send({
          item_packed: false
        })
        .end((err, response) => {
          response.should.have.status(422);
          response.should.be.json;
          response.body.should.be.a("object");
          response.body.should.have.property("error");
          response.body.error.should.be.a("string");
          done();
        });
    });
  });
  describe("PATCH /api/v1/items/:id", () => {
    it("should update/patch item from database", done => {
      chai.request(server)
        .patch("/api/v1/items/1")
        .send(
          {
            item_packed: false
          })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.text.should.equal('Item with id: ' + 1 + ' was updated.');
          Object.keys(response.body).length.should.equal(0);
          done();
        });
    });
    it("should give 404 if id not found", done => {
      chai.request(server)
        .patch("/api/v1/items/533")
        .send(
          {
            item_packed: false
          })
        .end((err, response) => {
          response.should.have.status(404);
          response.should.be.json;
          response.body.should.be.a("object");
          response.body.should.have.property("error");
          response.body.error.should.be.a("string");
          done();
        });
    });
    it("should give 422 if body has other parameter than required in the schema", done => {
      chai.request(server)
        .patch("/api/v1/items/1")
        .send(
          {
            asdf: false
          })
        .end((err, response) => {
          response.should.have.status(422);
          response.should.be.json;
          response.body.should.be.a("object");
          response.body.should.have.property("error");
          response.body.error.should.be.a("string");
          response.body.error.should.equal(`Expected format: { item_name: <String>, item_packed: <Boolean> }. Property that is not in the Schema was included.`);
          done();
        });
    });
  });
  describe("DELETE /api/v1/items", () => {
    it("should delete item from database", done => {
      chai.request(server)
        .delete("/api/v1/items/1")
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          Object.keys(response.body).length.should.equal(0);
          response.text.should.equal('Item with id: ' + 1 + ' was deleted.');
          done();
        });
    });
    it("should return 404 if item not found", done => {
      chai.request(server)
        .delete("/api/v1/items/999")
        .end((err, response) => {
          response.should.have.status(404);
          response.body.should.be.a("object");
          response.body.should.have.property("error");
          response.body.error.should.be.a("string");
          done();
        });
    });
  });
});