//server 8080

// const server = require('http').createServer();
// const io = require('socket.io')(server);
// io.on('connection', client => {
//   client.on('event', data => { /* … */ });
//   client.on('disconnect', () => { /* … */ });
// });

//Database3306

// server.listen(3000);
// template for setting up socket io in the server
// const app = require('express')();
// const server = require('http').createServer(app);
// const io = require('socket.io')(server);
// io.on('connection', () => { /* … */ });
// server.listen(3000)
// setting up and connecting socket io with express

var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.get("/", function(req, res) {
  res.sendfile("index.html");
});

users = [];
io.on("connection", function(socket) {
  console.log("A user connected");
  socket.on("setUsername", function(data) {
    console.log(data);
    if (users.indexOf(data) > -1) {
      socket.emit(
        "userExists",
        data + " username is taken! Try some other username."
      );
    } else {
      users.push(data);
      socket.emit("userSet", {
        username: data
      });
    }
  });

  socket.on("msg", function(data) {
    //Send message to everyone
    io.sockets.emit("newmsg", data);
  });
});

http.listen(3000, function() {
  console.log("listening on localhost:3000");
});
