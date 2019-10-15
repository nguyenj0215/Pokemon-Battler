var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../server");
var db = require("../models");
var expect = chai.expect;

// Setting up the chai http plugin
chai.use(chaiHttp);

var request;

describe("GET /api/users", function() {
  // Before each test begins, create a new request server for testing
  // & delete all examples from the db
  beforeEach(function() {
    request = chai.request(server);
    return db.sequelize.sync({ force: true });
  });

  it("should find all examples", function(done) {
    // Add some examples to the db to test with
    db.User.bulkCreate([
      { name: "First Example" },
      { name: "Second Example" }
    ]).then(function() {
      // Request the route that returns all examples
      request.get("/api/users").end(function(err, res) {
        var responseBody = res.body;

        // Run assertions on the response

        expect(responseBody[0])
          .to.be.an("object")
          .that.includes({
            name: "First Example"
          });

        // The `done` function is used to end any asynchronous tests
        done();
      });
    });
  });
});
