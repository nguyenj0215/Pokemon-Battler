  //For local hosting use
  //const socket = io.connect('localhost:8080');
  //For Heroku use 
  var socket = io.connect();

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
    baseStats: { hp: 75, atk: 22, def: 65, spa: 50, spd: 64, spe: 43 },
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

//By default neither player will be able to attack
var playerOneAttack;
var playerTwoAttack;
var playerOneName;
var playerTwoName;
var characterOne = pokemonArry[0];
var characterTwo = pokemonArry[1];
var game;
var characterOneHp = pokemonArry[0].baseStats.hp;
var characterTwoHp = pokemonArry[1].baseStats.hp;

/* eslint-disable no-restricted-globals */
(function init() {

  function battle(p1, p2) {

    $("#attackButton").show();

    if (p1) {

      $("#attackButton").on("click", function () {

        $("#attackButton").hide();

        characterTwoHp -= characterOne.baseStats.atk;

        //Client side check for win condition
        if (characterTwoHp <= 0) {
          $("#gameTextBox").html("Player one has won!");
        };

        //Update current client game text of user whos turn it currently is
        $("#gameTextBox").html(`${characterOne.species} attacked 
          ${characterTwo.species} for ${characterOne.baseStats.atk} 
          <br>
          ${characterOne.species} has ${characterOneHp} HP left. 
          <br>
          ${characterTwo.species} has ${characterTwoHp} HP left.`);

        socket.emit("playTurn", {
          room: game,
          playerOneAttack: true,
          playerTwoAttack: false,
          characterTwoHp: characterTwoHp,
          characterTwoName: characterTwo.species,
          characterOneHp: characterOneHp,
          characterOneName: characterOne.species
        });
      })
    } else if (p2) {

      $("#attackButton").on("click", function () {

        $("#attackButton").hide();

        characterOneHp -= characterTwo.baseStats.atk;

        $("#gameTextBox").html(`${characterTwo.species} attacked 
          ${characterOne.species} for ${characterTwo.baseStats.atk} 
          <br>
          ${characterOne.species} has ${characterOneHp} HP left. 
          <br>
          ${characterTwo.species} has ${characterTwoHp} HP left.`);

        if (characterOneHp <= 0) {
          $("#gameTextBox").html("Player two has won!");
        };

        socket.emit("playTurn", {
          room: game,
          playerOneAttack: false,
          playerTwoAttack: true,
          characterTwoHp: characterTwoHp,
          characterTwoName: characterTwo.species,
          characterOneHp: characterOneHp,
          characterOneName: characterOne.species
        });
        return;
      })
    }
  }

  $(".battlePage").hide();

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
      `Hello, ${playerOneName}. <br><br> Please ask your friend to enter Game ID: 
      ${data.room}. <br><br> Waiting for player 2 to connect...`);

    // Create game for player 1
    game = data.room;
  });

  socket.on('player1', () => {
    $("#gameTextBox").html(`An opponent has succesfully connected. <br> Wait for your turn!`)
  });


  socket.once('player2', (data) => {

    $("#gameTextBox").append(`Connected succesfully as ${playerTwoName}. <br> It is your turn first!`)

    // Create game for player 2
    game = data.room;

    playerOneAttack = false;
    playerTwoAttack = true;

    battle(playerOneAttack, playerTwoAttack);
  });


  socket.on('turnPlayed', (data) => {

    //Server check for win conditions
    if (data.characterTwoHp <= 0) {
      $("#attackButton").hide();
      socket.disconnect();
      $("#gameTextBox").html("Player one has won!");
      return;
    } else if (data.characterOneHp <= 0) {
      $("#attackButton").hide();
      socket.disconnect();
      $("#gameTextBox").html("Player two has won!");
      return;
    };

    //Update client side with data from server
    characterOneHp = data.characterOneHp;
    characterTwoHp = data.characterTwoHp;

    //Always Update the game text box of the next players client
    $("#gameTextBox").html(`${data.characterOneName}  has ${data.characterOneHp} HP left. <br>
      ${data.characterTwoName} has ${data.characterTwoHp} HP left.`);

    //Check who last attacked, and swap turns
    if (data.playerOneAttack) {
      playerOneAttack = false;
      playerTwoAttack = true;
      battle(playerOneAttack, playerTwoAttack);
    } else if (data.playerTwoAttack) {
      playerTwoAttack = false;
      playerOneAttack = true;
      battle(playerOneAttack, playerTwoAttack);
    }
    return;
  });

}());

