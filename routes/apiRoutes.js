var db = require("../models");

module.exports = function(app) {
  // Get all users
  app.get("/api/users", function(req, res) {
    db.User.findAll({}).then(function(dbUser) {
      console.log(dbUser);
      res.json(dbUser);
    });
  });

  // Create a new example
  app.post("/api/character", function(req, res) {
    db.Character.create(req.body).then(function(dbChar) {
      res.json(dbChar);
    });
  });
  // Get all characters with username
  app.get("/api/character", function(req, res) {
    db.Character.findAll({}).then(function(dbChar) {
      res.json(dbChar);
    });
  });

  // Delete an example by id
  app.delete("/api/user/:id", function(req, res) {
    db.User.destroy({ where: { id: req.params.id } }).then(function(dbUser) {
      res.json(dbUser);
    });
  });
};
