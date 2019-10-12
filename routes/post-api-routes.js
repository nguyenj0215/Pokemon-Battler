var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {
  // GET route for getting all of the posts
  app.get("/api/characters", function(req, res) {
    var query = {};
    if (req.query.user_id) {
      query.UserId = req.query.user_id;
    }
    db.Character.findAll({
      where: query,
      include: [db.User]
    }).then(function(dbCharacter) {
      res.json(dbCharacter);
    });
  });

  // Get route for retrieving a single post
  app.get("/api/characters/:id", function(req, res) {
    db.Character.findOne({
      where: {
        id: req.params.id
      },
      include: [db.User]
    }).then(function(dbCharacter) {
      res.json(dbCharacter);
    });
  });

  // POST route for saving a new post
  app.post("/api/characters", function(req, res) {
    db.Character.create(req.body).then(function(dbCharacter) {
      res.json(dbCharacter);
    });
  });

  // DELETE route for deleting posts
  app.delete("/api/characters/:id", function(req, res) {
    db.Character.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbCharacter) {
      res.json(dbCharacter);
    });
  });

  // PUT route for updating posts
  app.put("/api/characters", function(req, res) {
    db.Character.update(req.body, {
      where: {
        id: req.body.id
      }
    }).then(function(dbCharacter) {
      res.json(dbCharacter);
    });
  });
};
