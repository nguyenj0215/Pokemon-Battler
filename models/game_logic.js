

// what kind of attacks will each character have...such as what kind of fighting game is this.
// is it basic martial arts moves, fantasy style game.
// besides attacks what other kinds of game logic will we need to build for each character.
// Is it stationary fighting like old school pokemon?
// What kind of data from the socket does each character need to enter the battle?
// how many attacks per character?
// which ids will need to be used per character and their attack?
// how long of intervals between attacks?
// need to add battle has started messages and knockout/character has died messages.
// blocking moves?
// need to build health bars for each player.
// attack points/damage for each character.
// defense points for each character.
// different character classes.
var players = {};
var gameLogic = function(io) {
    io.on('connection', function (socket) {
        socket.on('disconnect', function () {
            safeRemove(socket.id)
        })

}