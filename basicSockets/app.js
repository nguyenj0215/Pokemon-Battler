const io = require("socket.io-client");
//this is to test the basic node app test
/* let socket = io.connect("http://localhost:3500") */
let games = io.connect("http://localhost:3500/games")

//also to test basic node app
/* socket.on("welcome", (data) => {
    console.log("Received: ", data);
}) */

// the refrence that was mention in server.js on line 17
games.on("Welcome", (msg) => {
    console.log("Received: ", msg);
});

games.emit("joinRoom", "battle");

games.on("newUser", (res) => console.log(res));

games.on("err", (err) => console.log(err));

games.on("success", (res) => console.log(res));