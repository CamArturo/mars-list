process.env.NODE_ENV = "development";

const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../server");

chai.use(chaiHttp);

describe("Client Routes", () => {
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
  describe("GET /api/v1/items", () => {
    it("should return all of the items with correct column names", done => {
      chai.request(server)
        .get("/api/v1/items")
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a("array");
          response.body[0].should.have.property("item_name");
          response.body[0].should.have.property("item_packed");
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
          item_packed: false
        })
        .end((err, response) => {
          response.should.have.status(201);
          response.body.should.be.a("object");
          response.body.should.have.property("id");
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
          done();
        });
    });
  });
});