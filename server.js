/* eslint-disable import/no-absolute-path */
/* eslint-disable import/no-unresolved */
const express = require('express');
const path = require('path');
var db = require("./models");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let rooms = 0;

app.use(express.static('public'));

app.get('/game', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/game.html'));
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/blog.html'));
});
// blog route loads blog.html
app.get('/blog', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/blog.html'));
});

// authors route loads battle.html
app.get('/battle', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/battle.html'));
});
app.get('/api/users', (req, res) => {
  db.User.findAll().then((dbCharacter) => {
    res.json(dbCharacter);
  });
});

app.get('/api/users/:id', (req, res) => {
  db.User.findOne({
    where: {
      id: req.params.id,
    },
    include: [db.Character],
  }).then((dbUser) => {
    res.json(dbUser);
  });
});

app.post('/api/users', (req, res) => {
  db.User.create(req.body).then((dbUser) => {
    res.json(dbUser);
  });
});

io.on('connection', (socket) => {
  // Create a new game room and notify the creator of game.
  socket.on('createGame', (data) => {
    socket.join(`room-${++rooms}`);
    socket.emit('newGame', { name: data.name, room: `room-${rooms}` });
  });

  // Connect the Player 2 to the room he requested. Show error if room full.
  socket.on('joinGame', (data) => {
    const room = io.nsps['/'].adapter.rooms[data.room];
    if (room && room.length === 1) {
      socket.join(data.room);
      socket.broadcast.to(data.room).emit('player1', {});
      socket.emit('player2', { name: data.name, room: data.room });
    } else {
      socket.emit('err', { message: 'Sorry, The room is full!' });
    }
  });

  socket.on('playTurn', (data) => {
    socket.broadcast.to(data.room).emit('turnPlayed', {
      tile: data.tile,
      room: data.room,
    });
  });

  socket.on('gameEnded', (data) => {
    socket.broadcast.to(data.room).emit('gameEnd', data);
  });
});

server.listen(process.env.PORT || 8080, function() {
  console.log(
    "🌎  Listening on port 8080. Visit http://localhost:8080/ in your browser."
  );
});



