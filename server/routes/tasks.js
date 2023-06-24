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
tasksRouter.post("/", (req, res) => {
  console.log("Inside POST, req.body: ", req.body);

  let note = req.body.note;
  let complete = req.body.complete;
  let priority = req.body.priority;

  // set queryText
  // parameterization
  let queryText = `INSERT INTO "tasks" ("note") VALUES ($1);`;

  // use pool
  pool
    .query(queryText, [note] )
    .then((result) => {
      console.log("Task added to database");
      res.sendStatus(201);
    })
    .catch((error) => {
      console.log(`Error making queryText: ${queryText}`, error);
      res.sendStatus(500);
    });
});

// PUT

// DELETE

// ORDER

// exporting router for server to use
module.exports = tasksRouter;
