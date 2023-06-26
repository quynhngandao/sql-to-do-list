$(document).ready(function () {
  // event listener
  getTask();

  // Submit/post button
  $("#submit-button").on("click", postTask);

  // Delete button
  $("#notcomplete").on("click", ".delete", deleteTask);

  // Update button
  $("#notcomplete").on("click", ".update", completeTask);

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
          };

          // POST ajax
          $.ajax({
            method: "POST",
            url: "/tasks",
            data: TaskObject,
          })
            .then((response) => {
              // Clear the user input after input is accepted
              // so new input can be enter without manually deleting
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
  // Check if task being deleted is in the complete or "not complete"
  let isCompleted =
    $(this).parent().parent().parent().attr("id") === "complete";

  // Assign the clicked delete button to deleteButton variable
  let deleteButton = this;

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

        // Remove the task from the DOM
        $(deleteButton).closest(".result").remove();

        // Update the global tasks variable
        // Filter function that remove the task that does not meet condition and
        // Return new array that only contains the task that pass the condition
        // If the task.id is not equal to the taskToDelete, keep the task in the tasks
        tasks = tasks.filter((task) => task.id !== taskToDelete);

        // If statement that check if the task being deleted in tasks global variable is marked as completed
        // The task is then set to task.id that is equal to taskToDelete
        // If task.completed is true then the task is set to completed
        // along with buttonClass being set to update completed
        if (isCompleted) {
          let task = tasks.find((task) => task.id === taskToDelete);
          if (task) {
            let buttonClass;
            if (task.completed) {
              buttonClass = "update completed";
            } else {
              buttonClass = "update";
            }

            // New row will be created and appended back in "not complete" in case the task get deleted from "complete"
            let row = $(`
              <div class="result" data-id="${task.id}">
                <p class="gradient-text">
                  <span>${task.note}</span>
                  <a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>
                  <button class="${buttonClass}" title="Update" data-toggle="tooltip">Done</button>
                </p>
              </div>
            `);

            // Row appended back to "not complete"
            $("#notcomplete").append(row);
          }
        } else {
          // If the task was deleted from the "not complete", remove it from the "complete"
          $("#complete").find(`[data-id="${taskToDelete}"]`).remove();
        }
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

  // Check if task being updated button has a class of "completed"
  let isCompleted = $(this).hasClass("completed");

  $.ajax({
    method: "PUT",
    url: `/tasks/${taskToUpdate}`,
    // Data to be sent an object with the complete
    // Since the default boolean for "complete" in database is FALSE
    // Meaning the task is not completed, or { complete: !isCompleted }
    // When the task has been completed, or { complete: isCompleted } , "complete" is switched to TRUE
    data: { complete: !isCompleted },
  })
    .then((response) => {
      console.log("Task is updated:", taskToUpdate);

      // This is same as DELETE, as explained above but with UPDATE
      if (isCompleted) {
        // Update button being clicked will have class of "completed"
        // to represent that a task is "completed"
        $(this).addClass("completed");

        // Same gist as delete but for update
        let task = tasks.find((task) => task.id === taskToUpdate);

        if (task) {
          let row = $(`
            <div class="result" data-id="${task.id}">
              <p class="gradient-text"><span>${task.note}</span>
                <a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>
                <button class="${buttonClass}" title="Update" data-toggle="tooltip"">Done</button>
              </p>
            </div>
          `);
          $("#notcomplete").append(row);
        }
      } else {
        // Update button being clicked again will no longer have class of "completed"
        $(this).removeClass("completed");

        // If the task is completed then it will be removed from "not complete" list and append to "complete" list
        $("#notcomplete").find(`[data-id="${taskToUpdate}"]`).remove();

        let task = tasks.find((task) => task.id === taskToUpdate);
        if (task) {
          let row = $(`
            <div class="result" data-id="${task.id}">
              <p class="gradient-text"><span>${task.note}</span>
              <a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>
              </p>
            </div>
          `);
          $("#complete").append(row);
        }
      }
    })
    .then(() => {
      // Re-bind the event listener for the delete button in the "complete" list
      $("#complete .delete").on("click", deleteTask);
    })
    .catch((error) => {
      console.log("Error with completing task", error);
    });
}

// RENDER Task
function renderTask(tasks) {
  // clear data before appending
  $("#notcomplete").empty();
  $("#complete").empty();

  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];

    let buttonClass;
    if (task.completed) {
      buttonClass = "update completed";
    } else {
      buttonClass = "update";
    }

    let row = $(`
      <div class="result" data-id="${task.id}">
        <p class="gradient-text"><span>${task.note}</span>
          <a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>
          <button class="${buttonClass}" title="Update" data-toggle="tooltip">Done</button>
        </p>
      </div>
    `);

    // append row to "complete" list if task is completed
    // append row to "not complete" list if otherwise
    if (task.completed) {
      $("#complete").append(row);
    } else {
      $("#notcomplete").append(row);
    }
  }
}
