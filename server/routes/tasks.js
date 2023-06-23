const express = require("express");
const pool = require("../modules/pool");
const tasksRouter = express.Router();

// GET
tasksRouter.get("/", (req, res) => {
  // set queryText
  let queryText = 'SELECT * FROM "tasks";';

  // use pool
  pool
    .query(queryText)
    .then((result) => {
      // send data to client
      res.send(result.rows);
    })
    .catch((error) => {
      console.log("Error getting data", error);
      res.sendStatus(500);
    });
});


// POST

// PUT

// DELETE

// ORDER

// exporting router for server to use
module.exports = tasksRouter;
