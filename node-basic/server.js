const express = require("express");
const app = express();
const port = 3000;

const server = app.listen(port, () => {
  console.log("Start Server : localhost:3000");
});

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

/**
 * http://localhost:3000
 */
app.get("/", (req, res) => {
  res.render("index.html");
});

/**
 * http://localhost:3000/about
 */
app.get("/about", (req, res) => {
  res.render("about.html");
});

var mysql = require("mysql");
var pool = mysql.createPool({
  connectionLimit: 10,
  host: "127.0.0.1",
  port: 3306,
  user: "admin",
  password: "1234",
  database: "dev",
});

/**
 * http://localhost:3000/user
 */
app.get("/user", (req, res) => {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!

    // Use the connection
    connection.query("select * from user", function (error, results, fields) {
      // res.send(JSON.stringify(results));
      console.log("results", results);
      res.render("user.html", { user: results });
      // When done with the connection, release it.
      connection.release();

      // Handle error after the release.
      if (error) throw error;

      // Don't use the connection here, it has been returned to the pool.
    });
  });
});

/**
 * Json return
 * http://localhost:3000/user/1
 */
app.get("/user/:id", (req, res) => {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!

    // Use the connection
    connection.query(
      `select * from user where id=${req.params.id}`,
      function (error, results, fields) {
        res.json(results);
        // When done with the connection, release it.
        connection.release();

        // Handle error after the release.
        if (error) throw error;

        // Don't use the connection here, it has been returned to the pool.
      }
    );
  });
});
