/* eslint-disable no-restricted-globals */
(function init() {

  var pokemonArry = [
    {
      name: "charmander",
      backImg:
        "https://www.tynker.com/projects/images/5a8310bd76f293f87d8b45c2/battler---charmander.png",
      frontImg:
        "https://vignette.wikia.nocookie.net/pokemon-reborn/images/d/d5/004.png/revision/latest?cb=20160924041753",
      num: 4,
      species: "Charmander",
      types: ["Fire"],
      genderRatio: { M: 0.875, F: 0.125 },
      baseStats: { hp: 100, atk: 25, def: 43, spa: 60, spd: 50, spe: 65 },
      abilities: { 0: "Blaze", H: "Solar Power" },
      heightm: 0.6,
      weightkg: 8.5,
      color: "Red",
      evos: ["charmeleon"],
      eggGroups: ["Monster", "Dragon"]
    },
    {
      name: "squirtle",
      backImg:
        "https://vignette.wikia.nocookie.net/pokemon-reborn/images/e/e9/007b.png/revision/latest?cb=20160924042430",
      frontImg:
        "https://steamuserimages-a.akamaihd.net/ugc/26237932152117820/A00AC1710EAF403395282CE858EC6CD8C70C0995/",
      num: 7,
      species: "Squirtle",
      types: ["Water"],
      genderRatio: { M: 0.875, F: 0.125 },
      baseStats: { hp: 100, atk: 22, def: 65, spa: 50, spd: 64, spe: 43 },
      abilities: { 0: "Torrent", H: "Rain Dish" },
      heightm: 0.5,
      weightkg: 9,
      color: "Blue",
      evos: ["wartortle"],
      eggGroups: ["Monster", "Water 1"]
    }
  ];

  $(".battlePage").hide();
  // const socket = io.connect('http://tic-tac-toe-realtime.herokuapp.com'),
 
    var socket = io.connect();
  

  //By default neither player will be able to attack
  var playerOneAttack = true;
  var playerTwoAttack = true;
  var playerOneName;
  var playerTwoName;
  var characterOne = pokemonArry[0];
  var characterTwo = pokemonArry[1];
  var game1;
  var game2;

  var characterOneHp = pokemonArry[0].baseStats.hp;
  var characterTwoHp = pokemonArry[1].baseStats.hp;

  function battle() {

      //on click of any of the 4 attack buttons which will all have this id
      if (playerOneAttack) {
        $("#attackButton").on("click", function () {
        console.log("player 1 attacking player 2")
        characterTwoHp -= characterOne.baseStats.atk;
        console.log(characterTwoHp)
        if (characterTwoHp < 0) {
          console.log("Character one wins");
          return;
        }
        socket.emit("playTurn", {room: game2});

      })
      } else if (playerTwoAttack) {
        $("#attackButton").on("click", function () {
        console.log("player 2 attacking player 1")
        characterOneHp -= characterTwo.baseStats.atk;
        console.log(characterOneHp)
        if (characterOneHp < 0) {
          console.log("Character two wins");
          return;
        }
        socket.emit("playTurn", {room: game1});
      })
      }
  }

  // Create a new game. Emit newGame event.
  $('#new').on('click', () => {
    playerOneName = $('#user').val();
    if (!playerOneName) {
      alert('Please enter your name.');
      return;
    }
    socket.emit('createGame', { playerOneName });
    $('.menu').css('display', 'none');
    $(".battlePage").show();
  });

  // Join an existing game on the entered roomId. Emit the joinGame event.
  $('#join').on('click', () => {
    playerTwoName = $('#nameJoin').val();
    const roomID = $('#room').val();

    if (!playerTwoName || !roomID) {
      alert('Please enter your name and game ID.');
      return;
    }
    socket.emit('joinGame', { playerTwoName, room: roomID });
    $('.menu').css('display', 'none');
    $(".battlePage").show();
  });

  socket.on('newGame', (data) => {
    console.log(
      "Hello," + playerOneName + ". Please ask your friend to enter Game ID:" +
      data.room + ". Waiting for player 2...");

    // Create game for player 1
    game1 = data.room;
  });
  socket.on('player1', (data) => {
    console.log("Player 1 has connected: " + playerOneName)
  });
   socket.on('turnPlayed', (data) => {
    if (playerOneAttack) {
      console.log("player one done attacking")
      playerOneAttack = false;
      playerTwoAttack = true;
      battle();
    } else {
      console.log("player two done attacking")
      playerTwoAttack = false;
      playerOneAttack = true;
      battle();
    }
  });

  socket.on('player2', (data) => {
    console.log("Player 2 has connected: " + playerTwoName)
    // Create game for player 2
    game2 = data.room;
    playerTwoAttack = false;
    battle();
  });

}());