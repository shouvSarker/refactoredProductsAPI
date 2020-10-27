const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
app.use(bodyParser.json());
const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database(
  "./App_Data/products.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the products database.");
  }
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/products", function (req, res) {
  console.log("Here are the products " + req.query.name);

  if (req.query.name != undefined) {
    var sql = "select * from products where Name = ? ";
    var params = [req.query.name];
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: rows,
      });
    });
  } else {
    var sql = "select * from products";
    var params = [];
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: rows,
      });
    });
  }
});

app.get("/products/:id", function (req, res) {
  res.send("Product with id: " + req.params.id);
});

app.post("/products", function (req, res) {
  res.send(req.body);
});

app.put("/products/:id", function (req, res) {
  res.send(req.body);
});

app.delete("/products/:id", function (req, res) {
  res.send(req.params.id);
});

app.get("/products/:id/options", function (req, res) {
  res.send(req.params.id);
});

app.get("/products/:id/options/:optionId", function (req, res) {
  res.send(req.params.optionId);
});

app.post("/products/:id/options", function (req, res) {
  res.send(req.body);
});

app.put("/products/:id/options/:optionId", function (req, res) {
  res.send(req.body);
});

app.delete("/products/:id/options/:optionId", function (req, res) {
  res.send(req.params.optionId);
});

app.listen(port, () => {
  console.log(`Refactored app listening at http://localhost:${port}`);
});
