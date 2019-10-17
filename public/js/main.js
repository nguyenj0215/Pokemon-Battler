/* eslint-disable no-restricted-globals */
(function init() {

  var pokemonArry = [
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
    },
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
      baseStats: { hp: 70, atk: 25, def: 43, spa: 60, spd: 50, spe: 65 },
      abilities: { 0: "Blaze", H: "Solar Power" },
      heightm: 0.6,
      weightkg: 8.5,
      color: "Red",
      evos: ["charmeleon"],
      eggGroups: ["Monster", "Dragon"]
    }
  ];

  $(".battlePage").hide();
  //For local hosting use
  const socket = io.connect('localhost:8080');
  //For Heroku use 
  //var socket = io.connect();


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
    console.log( playerOneAttack, playerTwoAttack)
    //on click of any of the 4 attack buttons which will all have this id
    if (playerOneAttack) {
      $("#attackButton").on("click", function () {
        console.log("player 1 attacking player 2")
        characterTwoHp -= characterOne.baseStats.atk;
        if (characterTwoHp <= 0) {
          $("#gameTextBox").html("Player one has won!")
          return;
        }
        $("#gameTextBox").html(characterOne.species + " has " + characterOneHp + " HP left.<br>" +
        characterTwo.species + " has " + characterTwoHp + " HP left. " )
        socket.emit("playTurn", {room: game2, playerOneAttack: false, playerTwoAttack:true, characterTwoHp: characterTwoHp, 
          characterTwoName: characterTwo.species, characterOneHp: characterOneHp, characterOneName: characterOne.species});

      })
    } else if (playerTwoAttack) {
      $("#attackButton").on("click", function () {
        console.log("player 2 attacking player 1")
        characterOneHp -= characterTwo.baseStats.atk;
        if (characterOneHp <= 0) {
          $("#gameTextBox").html("Player two has won!")
          return;
        }
        $("#gameTextBox").html(characterOne.species + " has " + characterOneHp + " HP left.<br>" +
        characterTwo.species + " has " + characterTwoHp + " HP left. " )
        socket.emit("playTurn", {room: game1, playerOneAttack: true, playerTwoAttack:false, characterTwoHp: characterTwoHp, 
          characterTwoName: characterTwo.species, characterOneHp: characterOneHp, characterOneName: characterOne.species});
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

  socket.once('newGame', (data) => {
    $("#gameTextBox").append(
      "Hello, " + playerOneName + ". Please ask your friend to enter Game ID:" +
      data.room + ". Waiting for player 2...");

    // Create game for player 1
    game1 = data.room;
  });
  socket.once('player1', (data) => {
    $("#gameTextBox").html("Player 1 connected sucessfully as: " + playerOneName)
  });
  socket.once('turnPlayed', (data) => {
    $("#gameTextBox").html(data.characterOneName + " has " + data.characterOneHp + " HP left.<br>" +
    data.characterTwoName + " has " + data.characterTwoHp + " HP left. " )
    if (!data.playerOneAttack && data.playerTwoAttack) {
      $("#gameTextBox").append("<br>Opponent done attacking. It's your turn")
      playerOneAttack = false;
      playerTwoAttack = true;
      battle();
    } else if (!data.playerTwoAttack && data.playerOneAttack) {
      $("#gameTextBox").append("<br>Opponent done attacking. It's your turn")
      playerTwoAttack = false;
      playerOneAttack = true;
      battle();
    }
  });

  socket.once('player2', (data) => {
    $("#gameTextBox").append("Player 2 connected succesfully as: " + playerTwoName + ". <br> You have the first attack.")
    // Create game for player 2
    game2 = data.room;
    playerTwoAttack = false;
    battle();

  });

}());