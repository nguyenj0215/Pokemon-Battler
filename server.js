require("dotenv").config();

/* eslint-disable import/no-absolute-path */
/* eslint-disable import/no-unresolved */
var express = require("express");

var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var db = require("./models");

// var PORT = process.env.PORT || 8080;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Room id will start at room-0
var rooms = 0;

//Static directory
app.use(express.static("public"));

// Routes
require("./routes/user-api-routes.js")(app);
require("./routes/htmlRoutes.js")(app);

var syncOptions = { force: false };

//If running a test, set syncOptions.force to true
//clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  //Connection to socket
  io.on("connection", function(socket) {
    // Create a new game room and notify the creator of game.
    socket.on("createGame", function(data) {
      socket.join("room-" + rooms++);
      console.log(rooms);
      socket.emit("newGame", { name: data.name, room: "room-" + rooms++ });
    });

    // Connect the Player 2 to the room he requested. Show error if room full.
    socket.on("joinGame", function(data) {
      var room = io.nsps["/"].adapter.rooms[data.room];
      if (room && room.length === 1) {
        socket.join(data.room);
        socket.broadcast.in(data.room).emit("player1", {});
        socket.emit("player2", { name: data.name, room: data.room });
      } else {
        socket.emit("err", { message: "Sorry, The room is full!" });
      }
    });

    socket.on("playTurn", function(data) {
      socket.broadcast.to(data.room).emit("turnPlayed", {
        tile: data.tile,
        room: data.room
      });
    });

    socket.on("gameEnded", function(data) {
      socket.broadcast.to(data.room).emit("gameEnd", data);
    });
  });

  server.listen(process.env.PORT || 8080, function() {
    console.log(
      "🌎  Listening on port 8080. Visit http://localhost:8080/ in your browser."
    );
  });
});

module.exports = app;
