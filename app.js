const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const nodemon = require("nodemon");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "todoApplication.db");

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server/DB started");
    });
  } catch (error) {
    console.log(error);
  }
};

initializeDbAndServer();

console.log(db.all());

app.get("/todos/", async (request, response) => {
  const { todo = "", priority = "", status = "" } = request.query;
  const getTodoQuery = `
    SELECT
        *
    FROM
        todo
    WHERE
        status LIKE %'${status}'%
    ;
  `;
  const todoArray = await db.all(getTodoQuery);
  response.send(todoArray);
});

module.exports = app;
