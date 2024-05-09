const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
  // const createTableQuery = `
  //   CREATE TABLE IF NOT EXISTS test (
  //     id INT AUTO_INCREMENT PRIMARY KEY,
  //     username VARCHAR(255) NOT NULL,
  //     email VARCHAR(255) NOT NULL
  //   )
  // `;

  // const insertValuesQuery = `
  //   INSERT INTO test (username, email) VALUES
  //   ('user1', 'user1mail'),
  //   ('user2', 'user2mail'),
  //   ('user3', 'user3mail')
  //   `;

  // connection.query(createTableQuery, (queryErr, result) => {
  //   if (queryErr) {
  //     console.error("Error creating table:", queryErr);
  //     return;
  //   }
  //   console.log("Table 'users' created successfully");
  // });

  // connection.query(insertValuesQuery, (queryErr, result) => {
  //   if (queryErr) {
  //     console.error("Error inserting values:", queryErr);
  //     return;
  //   }
  //   console.log("Inserted values into 'users' table successfully");
  // });
});

app.get("/", (req, res) => {
  connection.query("SELECT * FROM test", (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Error executing query");
      return;
    }
    res.status(200).json(result);
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server started on port 3000");
});
