/* eslint-disable prettier/prettier */
$(document).ready(function() {
  // Getting jQuery references to the post body, title, form, and author select
  var titleInput = $("#title");
  var cmsForm = $("#cms");
  var userSelect = $("#user");
  // Adding an event listener for when the form is submitted
  $(cmsForm).on("submit", handleFormSubmit);
  // Gets the part of the url that comes after the "?" (which we have if we're updating a post)
  var url = window.location.search;
  var characterId;
  var userId;
  // Sets a flag for whether or not we're updating a post to be false initially
  var updating = false;

  // If we have this section in our url, we pull out the post id from the url
  // In '?post_id=1', postId is 1
  if (url.indexOf("?character_id=") !== -1) {
    characterId = url.split("=")[1];
    getCharacterData(characterId, "character");
  }
  // Otherwise if we have an author_id in our url, preset the author select box to be our Author
  else if (url.indexOf("?user_id=") !== -1) {
    userId = url.split("=")[1];
  }

  // Getting the authors, and their posts
  getUsers();

  // A function for handling what happens when the form to create a new post is submitted
  function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the post if we are missing a body, title, or author
    if (!titleInput.val().trim() || !userSelect.val()) {
      return;
    }
    // Constructing a newPost object to hand to the database
    var newCharacter = {
      title: titleInput.val().trim(),
      UserId: userSelect.val()
    };

    // If we're updating a post run updatePost to update a post
    // Otherwise run submitPost to create a whole new post
    if (updating) {
      newCharacter.id = characterId;
      updateCharacter(newCharacter);
    } else {
      submitCharacter(newCharacter);
    }
  }

  // Submits a new post and brings user to blog page upon completion
  function submitCharacter(character) {
    $.post("/api/characters", character, function() {
      window.location.href = "/blog";
    });
  }

  // Gets post data for the current post if we're editing, or if we're adding to an author's existing posts
  function getCharacterData(id, type) {
    var queryUrl;
    switch (type) {
    case "character":
      queryUrl = "/api/characters/" + id;
      break;
    case "user":
      queryUrl = "/api/users/" + id;
      break;
    default:
      return;
    }
    $.get(queryUrl, function(data) {
      if (data) {
        console.log(data.UserId || data.id);
        // If this post exists, prefill our cms forms with its data
        titleInput.val(data.title);
        userId = data.UserId || data.id;
        updating = true;
      }
    });
  }

  // A function to get Authors and then render our list of Authors
  function getUsers() {
    $.get("/api/users", renderUserList);
  }
  // Function to either render a list of authors, or if there are none, direct the user to the page
  // to create an author first
  function renderUserList(data) {
    if (!data.length) {
      window.location.href = "/users";
    }
    $(".hidden").removeClass("hidden");
    var rowsToAdd = [];
    for (var i = 0; i < data.length; i++) {
      rowsToAdd.push(createUserRow(data[i]));
    }
    userSelect.empty();
    console.log(rowsToAdd);
    console.log(userSelect);
    userSelect.append(rowsToAdd);
    userSelect.val(userId);
  }

  // Creates the author options in the dropdown
  function createUserRow(user) {
    var listOption = $("<option>");
    listOption.attr("value", user.id);
    listOption.text(user.name);
    return listOption;
  }

  // Update a given post, bring user to the blog page when done
  function updateCharacter(character) {
    $.ajax({
      method: "PUT",
      url: "/api/characters",
      data: character
    }).then(function() {
      window.location.href = "/blog";
    });
  }
});
