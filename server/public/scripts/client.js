console.log("JS");

$(document).ready(function () {
  console.log("JQ");

  // event listener
  getTask();
  // submit/post
  //   $("#button-addon2").on("click", postMessage);
  // delete
  // update
});

// GET
function getTask() {
  console.log("In getTask");
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

// RENDER
function renderTask(tasks) {
  // clear data before appending
  $("#result-div").empty();

  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    let row = $(`
        <tr data-id = ${task.id}>
      <th scope="row"></th>
      <td>${task.note}</td>
      <td>${task.complete}</td>
      <td>${task.priority}</td>
      <td><button class = "edit-button">Edit</button></td>
    <td><button class = "delete-button">Delete</button></td>
        </tr>
    `);
    // append row 
    $("#result-div").append(row);
  }
}
