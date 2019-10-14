$(document).ready(function() {
  /* global moment */

  // blogContainer holds all of our posts
  var blogContainer = $(".blog-container");
  var characterCategorySelect = $("#category");
  // Click events for the edit and delete buttons
  $(document).on("click", "button.delete", handleCharacterDelete);
  $(document).on("click", "button.edit", handleCharacterEdit);
  // Variable to hold our posts
  var characters;

  var url = window.location.search;
  var userId;
  if (url.indexOf("?user_id=") !== -1) {
    userId = url.split("=")[1];
    getCharacters(userId);
  } else {
    getCharacters();
  }

  function getCharacters(user) {
    userId = user || "";
    if (userId) {
      userId = "/?user_id=" + userId;
    }
    $.get("/api/characters" + userId, function(data) {
      console.log("Characters", data);
      characters = data;
      if (!characters || !characters.length) {
        displayEmpty(user);
      } else {
        initializeRows();
      }
    });
  }

  // This function does an API call to delete posts
  function deleteCharacter(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/characters/" + id
    }).then(function() {
      getCharacters(characterCategorySelect.val());
    });
  }

  // InitializeRows handles appending all of our constructed post HTML inside blogContainer
  function initializeRows() {
    blogContainer.empty();
    var charactersToAdd = [];
    for (var i = 0; i < characters.length; i++) {
      charactersToAdd.push(createNewRow(characters[i]));
    }
    blogContainer.append(charactersToAdd);
  }

  // This function constructs a post's HTML
  function createNewRow(character) {
    var formattedDate = new Date(character.createdAt);
    formattedDate = moment(formattedDate).format("MM/DD/YY, h:mm a");
    var newCharacterCard = $("<div>");
    newCharacterCard.addClass("card");
    var newCharacterCardHeading = $("<div>");
    newCharacterCardHeading.addClass("card-header");
    var deleteBtn = $("<button>");
    deleteBtn.text("x");
    deleteBtn.addClass("delete btn btn-danger");
    var editBtn = $("<button>");
    editBtn.text("EDIT");
    editBtn.addClass("edit btn btn-info");
    var newCharacterTitle = $("<h2>");
    var newCharacterDate = $("<small>");
    var newCharacterUser = $("<h5>");
    newCharacterUser.text("User: " + character.User.name);
    newCharacterUser.css({
      float: "right",
      color: "blue",
      "margin-top": "-10px"
    });
    newCharacterTitle.text(character.title + " ");
    newCharacterDate.text(formattedDate);
    newCharacterTitle.append(newCharacterDate);
    newCharacterCardHeading.append(deleteBtn);
    newCharacterCardHeading.append(editBtn);
    newCharacterCardHeading.append(newCharacterTitle);
    newCharacterCardHeading.append(newCharacterUser);
    newCharacterCard.append(newCharacterCardHeading);
    newCharacterCard.data("character", character);
    return newCharacterCard;
  }

  // This function figures out which post we want to delete and then calls deletePost
  function handleCharacterDelete() {
    var currentCharacter = $(this)
      .parent()
      .parent()
      .data("character");
    deleteCharacter(currentCharacter.id);
  }

  // // This function displays a message when there are no characters
  // function displayEmpty(id) {
  //   var query = window.location.search;
  //   var partial = "";
  //   if (id) {
  //     partial = " for User #" + id;
  //   }
  //   blogContainer.empty();
  //   var messageH2 = $("<h2>");
  //   messageH2.css({ "text-align": "center", "margin-top": "50px" });
  //   messageH2.html(
  //     "No characters yet" +
  //       partial +
  //       ", navigate <a href='/cms" +
  //       query +
  //       "'>here</a> in order to get started."
  //   );
  //   blogContainer.append(messageH2);
  // }
});
