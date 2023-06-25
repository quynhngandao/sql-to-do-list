console.log("JS");

$(document).ready(function () {
  console.log("JQ");

  // event listener
  getTask();
  // submit/post
  $("#submit-button").on("click", postTask);
  // delete
  $("#result-div").on("click", ".delete-button", deleteTask);
  // update
  $("#result-div").on("click", ".btn.btn-outline-primary", completeTask);
});

// global tasks
let tasks = [];

// GET
function getTask() {
  // console.log("In getTask");
  $.ajax({
    method: "GET",
    url: "/tasks",
  })
    .then((response) => {
        // set global tasks to response 
        let tasks = response
      renderTask(tasks);
    })
    .catch((error) => {
      console.log("Error in GET client", error);
    });
}

// POST
function postTask() {
  // console.log("In postTask")
  // taskObject
  let TaskObject = {
    note: $("#taskInput").val(),
  };

  // sweetalert
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
          let TaskObject = {
            note: $("#taskInput").val(),
          };

          $.ajax({
            method: "POST",
            url: "/tasks",
            data: TaskObject,
          })
            .then((response) => {
              $("#taskInput").val("");
              getTask();
            })
            .catch((error) => {
              console.log("Error in POST", error);
              alert("Unable to add task");
            });
          swal.fire(
            "Task successfully added!"
          );
        } else {
          swal.fire("Action cancelled");
        }
      });
  });
}

// DELETE
function deleteTask() {
  // console.log("In deleteTask")
  let taskToDelete = $(this).parent().parent().data("id");

  // sweetalert
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
          swal.fire("Succeed");
        } else {
          swal.fire("Cancelled");
        }
      });
  });

  // ajax taskDelete
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

// PUT
function completeTask() {
  let taskToUpdate = $(this).parent().parent().data("id");
  $.ajax({
    method: "PUT",
    url: `/tasks/${taskToUpdate}`,
  })
    .then((response) => {
      console.log("Task is updated:", taskToUpdate);
      $(this).addClass("clicked");
       // Update the completion status in the task object
       let task = tasks.find((task) => task.id === taskToUpdate);
       if (task) {
         task.completed = !task.completed;
       }
      
    })
    .catch((error) => {
      console.log("Error with completing task", error);
    });
}

// RENDER
function renderTask(tasks) {
  // clear data before appending
  $("#result-div").empty();

  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    let row = $(`

    <ul class="result" data-id="${task.id}">
        <li>${task.note}
          <button class="delete-button">🗑️</button>
          <button type="button" class="btn btn-outline-primary ${
            task.completed ? 'complete-button clicked' : 'complete-button'
          }" data-bs-toggle="button" autocomplete="off">Complete</button>
          <button class="edit-button">📝</button>
        </li>
      </ul>

    `);
    // append row
    $("#result-div").append(row);
  }
}
