const express = require("express");
const app = express();
const port = 3500;
const http = require("http").createServer();

const io = require("socket.io")(http);

//this code ix for a simple node app used as a test
/* io.on("connection", (socket) =>{
    socket.emit("welcome", "hello there and welcome to ..");
    console.log("New Client is connected!");
}) */

const gameRooms = ["battle"];

// this will be the route that the app will follow
io.of("/games")
.on("connection", (socket) => {
    console.log("new Client")
    //the first one is used as reference on the client side code after the coma is what the client will see
    socket.emit("Welcome", " Hello and welcome to our game");

    // create room
    socket.on("joinRoom", (room) => {
        if(gameRooms.includes(room)) {
        socket.join(room);
        //this will broadcast to everyone in the room that someone joined
        io.
        of("/games")
        .in(room)
        .emit("newUser", "New Player has joined the " + room);
        return socket.emit("success", "you have successfully joined this room")
        }else {
            return socket.emit("err", "No room named " + room);
        }

        socket.disconnect();
    });
});


http.listen(port, () => {
    console.log("server is listing on localhost:" + port);
})