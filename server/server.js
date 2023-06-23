// require dependencies
const express = require("express");
const bodyParser = require("body-parser");
let tasksRouter = require("./routes/tasks");

// PORT
const PORT = 5000;

// use express
const app = express();
// use body-parser
app.use(bodyParser.urlencoded({ extended: true }));
// serve static file
app.use(express.static("server/public"));
// use router
app.use("/tasks", tasksRouter);

// Start server
app.listen(PORT, () => {
  console.log("up and running on port", PORT);
});
