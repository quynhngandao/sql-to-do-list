$(document).ready(function () {
  // Event listener
  getTask();

  // Submit/post button
  $("#submit-button").on("click", postTask);

  // Delete button
  $("#notcomplete").on("click", ".delete", deleteTask);
  $("#complete").on("click", ".delete", deleteTask);

  // Update button
  $("#notcomplete, #complete").on("click", ".update", completeTask);

  // Toggle tool for easier identification
  $("body").tooltip({ selector: "[data-toggle=tooltip]" });
});

// Global variable to store the tasks
let tasks;

// GET tasks
function getTask() {
  $.ajax({
    method: "GET",
    url: "/tasks",
  })
    .then((response) => {
      // Store tasks in the global variable
      tasks = response;

      // Render the tasks on the page
      renderTask(tasks);
    })
    .catch((error) => {
      console.log("Error in GET client", error);
    });
}

// POST task
function postTask() {
  // User input as object in postTask()
  let TaskObject = {
    note: $("#taskInput").val(),
  };

  // sweetalert for POST
  $.getScript("https://cdn.jsdelivr.net/npm/sweetalert2@11", function () {
    swal
      .fire({
        title: "Do you want to add the task?",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#C64EB2",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No, cancel",
      })
      .then((result) => {
        if (result.isConfirmed) {
          // User input as object in sweetalert
          let TaskObject = {
            note: $("#taskInput").val(),
            completed: false, // Set completed status to false initially
          };

          // POST ajax
          $.ajax({
            method: "POST",
            url: "/tasks",
            data: TaskObject,
          })
            .then((response) => {
              // Clear the user input after input is accepted
              // so new input can be entered without manually deleting
              $("#taskInput").val("");

              // Get the updated task list
              getTask();
              console.log("Added task");
            })
            .catch((error) => {
              console.log("Error in POST", error);
              alert("Unable to add task");
            });
          swal.fire("Task successfully added!");
        } else {
          swal.fire("Action cancelled");
        }
      });
  });
}

// DELETE task
function deleteTask() {
  // Retrieve data-id attribute from parent element of the clicked delete button
  let taskToDelete = $(this).parent().parent().data("id");

  // sweetalert for DELETE
  $.getScript("https://cdn.jsdelivr.net/npm/sweetalert2@11", function () {
    swal
      .fire({
        title: "Are you sure you want to delete this task?",
        text: "You will not be able to reverse this action!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, DELETE",
        cancelButtonText: "No, CANCEL",
      })
      .then((result) => {
        if (result.isConfirmed) {
          taskDelete();
          swal.fire("Action Successful");
        } else {
          swal.fire("Action cancelled");
        }
      });
  });

  // DELETE ajax
  function taskDelete() {
    $.ajax({
      method: "DELETE",
      url: `/tasks/${taskToDelete}`,
    })
      .then((response) => {
        console.log("Deleted task", response);

        getTask();
      })
      .catch((error) => {
        console.log("Error in delete", error);
      });
  }
}

// PUT Task
function completeTask() {
  // Retrieve data-id attribute from parent element of the clicked update button
  let taskToUpdate = $(this).parent().parent().data("id");

  $.ajax({
    method: "PUT",
    url: `/tasks/${taskToUpdate}`,
  })
    .then((response) => {
      console.log("Task is updated:", taskToUpdate);

      // Find the task in the tasks array and update its completed status
      const updatedTask = tasks.find((task) => task.id === taskToUpdate);
      updatedTask.completed = true;

      // Render the updated tasks, which will move the task to the "Complete" list
      renderTask(tasks);
    })
    .catch((error) => {
      console.log("Error with completing task", error);
    });
}

// RENDER Task
function renderTask(tasks) {
  // Clear data before appending
  $("#notcomplete").empty();
  $("#complete").empty();

  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    let newTime = new Date().toLocaleString("en-US");
    let buttonClass;
    if (task.completed) {
      buttonClass = "update completed";
      let row = $(`
      <div class="result" data-id="${task.id}">
        <p class="gradient-text"><span>${task.note}</span>
        <p class="gradient-text"><span> Completed on: ${newTime}</span>
        <a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>
          </p>
      </div>
    `);

      // Append to complete
      $("#complete").append(row);
      
    } else {
      buttonClass = "update";

      let row = $(`
      <div class="result" data-id="${task.id}">
        <p class="gradient-text"><span>${task.note}</span>
          <a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>
          <button class="${buttonClass}" title="Complete" data-toggle="tooltip">Done</button>
          </p>
      </div>
    `);

      // Append to not complete
      $("#notcomplete").append(row);
    }
  }
}

