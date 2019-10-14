var path = require("path");

// Routes
// =============================================================
module.exports = function(app) {
  // index route loads view.html
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/blog.html"));
  });

  // blog route loads blog.html
  app.get("/blog", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/blog.html"));
  });

  // authors route loads battle.html
  app.get("/battle", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/battle.html"));
  });
};
