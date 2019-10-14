$(document).ready(function() {
  // Getting references to the name input and author container, as well as the table body
  var nameInput = $("#user-name");
  // Adding event listeners to the form to create a new object, and the button to delete
  $(document).on("submit", "#user-form", handleUserFormSubmit);
  $(document).on("click", ".createNewUser", handleCreateUserButton);

  // A function to handle what happens when the form is submitted to create a new Author
  function handleUserFormSubmit(event) {
    event.preventDefault();
    // Don't do anything if the name fields hasn't been filled out
    if (
      !nameInput
        .val()
        .trim()
        .trim()
    ) {
      return;
    }
    // Calling the upsertAuthor function and passing in the value of the name input
    upsertUser({
      name: nameInput.val().trim()
    });
    $(".modal").modal("hide");
  }

  function upsertUser(userData) {
    $.post("/api/users", userData);
  }

  function handleCreateUserButton(event) {
    event.preventDefault();
    $(".modal").modal("show");
  }
});
