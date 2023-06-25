const express = require("express");
const pool = require("../modules/pool");
const tasksRouter = express.Router();

// ORDER

// GET
tasksRouter.get("/", (req, res) => {
  // set queryText
  let queryText = 'SELECT * FROM "tasks" ORDER BY "id" ;';

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

  // set queryText
  // parameterization
  let queryText = `INSERT INTO "tasks" ("note") VALUES ($1);`;

  // use pool
  pool
    .query(queryText, [note])
    .then((result) => {
      console.log("Task added to database");
      res.sendStatus(201);
    })
    .catch((error) => {
      console.log(`Error making queryText: ${queryText}`, error);
      res.sendStatus(500);
    });
});

// PUT for COMPLETE
tasksRouter.put("/:id", (req, res) => {
  console.log("Inside PUT, req.params: ", req.params);

  let taskToUpdate = req.params.id;

  // set queryText
  let queryText = `UPDATE "tasks" SET "complete" = NOT "complete" WHERE id = $1;`;

  // use pool
  pool
    .query(queryText, [taskToUpdate])
    .then((result) => {
      console.log(`Task completed: ${taskToUpdate}`);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Error making database query", error);
      res.sendStatus(500);
    });
});

// PUT for EDIT

// DELETE
tasksRouter.delete("/:id", (req, res) => {
  // set queryText
  // parameterization
  let taskToDelete = req.params.id;
  let queryText = `DELETE FROM "tasks" WHERE id = $1;`;

  // use pool
  pool
    .query(queryText, [taskToDelete])
    .then((result) => {
      console.log("Task deleted");
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Error making database query: ", error);
      res.sendStatus(500);
    });
});

// exporting router for server to use
module.exports = tasksRouter;
