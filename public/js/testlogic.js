require(pokemonArray);

var playerOneConnected = false;
var playerTwoConnected = false;

//By default neither player will be able to attack
var playerOneAttack = false;
var playerTwoAttack = false;

var characterOneHp;
var characterTwoHp;

//Once a player connects change connected var
//However sockets detect connection will trigger this
playerOneConnected = true;
playerTwoConnected = true;

//Only if two players are connected start game
if (playerOneConnected && playerTwoConnected) {
  startGame();
}

function startGame() {
  //Randomize number in pokemon array to select pokemon
  characterOne = pokemonArry[Math.floor(Math.random() * pokemonArry.length)];
  characterTwo = pokemonArry[Math.floor(Math.random() * pokemonArry.length)];

  //Reset hp of both charaters to hardcoded default value
  characterOneHp = characterOne.basestats.hp;
  characterTwoHp = characterTwo.basestats.hp;

  //Player one will always get the first attack
  playerOneAttack = true;
  //Only run fight loop while both characters have health remaining
  while (characterOneHp > 0 && characterTwoHp > 0) {
    //on click of any of the 4 attack buttons which will all have this id
    if (playerOneAttack) {
      $(document).on(
        "click",
        "#attackButton",
        attackOther(characterOne, characterTwo)
      );
      playerOneAttack = false;
      playerTwoAttack = true;
    } else if (playerTwoAttack) {
      $(document).on(
        "click",
        "#attackButton",
        attackOther(characterTwo, characterOne)
      );
      playerTwoAttack = false;
      playerOneAttack = true;
    }
  }
  //If either characters is dead
  if (characterOneHp < 0) {
    //Write to game text box that character two has won
    stopGame();
  } else if (characterTwoHp < 0) {
    //Write to game text box that character one has won
    stopGame();
  }
}

function attackOther(attackingPlayer, attackedPlayer) {
  attackedPlayer.basestats.hp -= attackingPlayer.basestats.attack;
  //Write to game text that playerOne's characterOne.species attacked playerTwo's characterTwo.species for characterOne.attack
  //playerTwo's characterTwo.species has characterTwo.basestats.hp left
}

function stopGame() {
  playerOneAttack = false;
  playerTwoAttack = false;
}
