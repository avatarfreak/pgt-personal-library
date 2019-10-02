/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");
const uuid = require("uuid/v1");
chai.use(chaiHttp);
let id;
suite("Functional Tests", function() {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test("#example Test GET /api/books", function(done) {
    chai
      .request(server)
      .get("/api/books")
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");
        assert.property(
          res.body[0],
          "commentcount",
          "Books in array should contain commentcount"
        );
        assert.property(
          res.body[0],
          "title",
          "Books in array should contain title"
        );
        assert.property(
          res.body[0],
          "_id",
          "Books in array should contain _id"
        );
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function() {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function() {
        test("Test POST /api/books with title", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "Node" })
            .end((err, res) => {
              assert.property(res.body, "title", "should contain title");
              assert.equal(res.status, 200);
              assert.isObject(res.body, "is Object");
              assert.equal(res.body.title, "Node");

              id = res.body._id;
              done();
            });
        });

        test("Test POST /api/books with no title given", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "" })
            .end((err, res) => {
              assert.equal(res.status, 400);
              assert.equal(res.text, "Title is missing");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function() {
      test("Test GET /api/books", function(done) {
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "Array of books");
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function() {
      test("Test GET /api/books/[id] with id not in db", function(done) {
        chai
          .request(server)
          .get("/api/books/[id]")
          .query({ id: "notvalid" })
          .end((err, res) => {
            assert.equal(res.status, 400);
            assert.equal(res.text, "no match");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function(done) {
        chai
          .request(server)
          .get("/api/books/2c5ea4c0-4067-11e9-8bad-9b1deb4d3b7d")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, "Node js");
            assert.equal(res.body._id, "2c5ea4c0-4067-11e9-8bad-9b1deb4d3b7d");
            assert.isArray(res.body.comments, ["javascript backend."]);
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function() {
        test("Test POST /api/books/[id] with comment", function(done) {
          chai
            .request(server)
            .post("/api/books/2c5ea4c0-4067-11e9-8bad-9b1deb4d3b7d")
            .send({
              id: "2c5ea4c0-4067-11e9-8bad-9b1deb4d3b7d",
              comment: "node is non blocking"
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body.title, "Node js");
              assert.equal(res.body.comments[1], "node is non blocking");
              assert.equal(res.body.commentcount, 2);
              done();
            });
        });
      }
    );
  });
});
