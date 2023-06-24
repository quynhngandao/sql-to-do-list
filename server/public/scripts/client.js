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
});

// GET
function getTask() {
  // console.log("In getTask");
  $.ajax({
    method: "GET",
    url: "/tasks",
  })
    .then((response) => {
      renderTask(response);
    })
    .catch((error) => {
      console.log("Error in GET client", error);
    });
}

// POST
function postTask() {
  // console.log("In postTask")
  let TaskObject = {
    note: $("#taskInput").val(),
  };
  console.log("object", TaskObject);
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

// RENDER
function renderTask(tasks) {
  // clear data before appending
  $("#result-div").empty();

  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    let row = $(`

    <ul class="result" data-id = ${task.id}>
        <li>${task.note}
        <button class="delete-button">🗑️</button>
            <button class = "complete-button">✅</button>
            <button class = "edit-button">📝</button>
        </li>
    </ul>

    `);
    // append row
    $("#result-div").append(row);
  }
}
