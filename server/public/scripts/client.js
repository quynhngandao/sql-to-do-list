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

// POST 
function postTask() {
    let object = {
        note: $('#task-input').val()
    };
    $.ajax({
        method: "POST",
        url:"/tasks",
        data: object,
    }).then((response) => {
        $('#task-input').val("");
        getTask();
    });
}

// RENDER
function renderTask(tasks) {
  // clear data before appending
  $("#result-div").empty();

  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    let row = $(`
    <div id="result">
        <ul data-id = ${task.id}>
  <p>${task.note}
<button id="priority-button">‼️</button>
  <button id="complete-button">☑</button>
   <button id= "edit-button"> ✐ </button>
  <button id= "delete-button"> ⅹ </button>
  </p>
        </ul>
   </div>
    `);
    // append row 
    $("#result-div").append(row);
  }
}
