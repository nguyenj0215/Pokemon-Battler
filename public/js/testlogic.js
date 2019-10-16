var pokemon = require("./pokemon")

(function init() {
    const P1 = pokemon[1];
    const P2 = pokemon[2];
    let player;
    let game;

    const socket = io.connect('http://localhost:8080');
};