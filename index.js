const ospreyMiddleware = require("osprey-middleware");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const sqlite3 = require("sqlite3").verbose();

app.use(bodyParser.json());
//const router = express.Router().use(ospreyMiddleware("definition.raml"));

//helpers
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

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/products", function (req, res) {
  //TODO: Refactor this
  if (req.query.name != undefined) {
    var sql = "select * from products where Name = ? ";
    var params = [req.query.name];
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        Items: rows,
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
        Items: rows,
      });
    });
  }
});

app.post("/products", function (req, res) {
  var sql =
    "INSERT INTO products (Id, Name, Description, Price, DeliveryPrice) VALUES (?,?,?,?,?) ";
  var newId = uuid();
  var params = [
    newId,
    req.body.Name,
    req.body.Description,
    req.body.Price,
    req.body.DeliveryPrice,
  ];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    var insertedProduct = Object.assign({ id: newId }, req.body);
    res.status(201).json(insertedProduct);
  });
});

app.get("/products/:id", function (req, res) {
  var sql = "select * from products where Id = ? ";
  var params = [req.params.id];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows[0]);
  });
});

app.put("/products/:id", function (req, res) {
  var sql =
    "UPDATE products SET Name = ?, Description = ?, Price = ?, DeliveryPrice = ? WHERE Id = ? ";
  var params = [
    req.body.Name,
    req.body.Description,
    req.body.Price,
    req.body.DeliveryPrice,
    req.params.id,
  ];

  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    var updatedProduct = Object.assign({ id: req.params.id }, req.body);
    res.json(updatedProduct);
  });
});

app.delete("/products/:id", function (req, res) {
  var sql = "DELETE FROM products WHERE Id = ? ";
  var params = [req.params.id];

  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json("Product " + req.params.id + " deleted successfully");
  });
});

app.get("/products/:id/options", function (req, res) {
  var sql = "select * from productoptions where productid = ? ";
  var params = [req.params.id];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      Items: rows,
    });
  });
});

app.post("/products/:id/options", function (req, res) {
  console.log("Sending request");
  var sql =
    "INSERT INTO productoptions (Id, ProductId, Name, Description) VALUES (?,?,?,?) ";
  var optionId = uuid();
  var params = [uuid(), req.params.id, req.body.Name, req.body.Description];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    var insertedOption = Object.assign(
      { Id: optionId, ProductId: req.params.id },
      req.body
    );
    res.status(201).json(insertedOption);
  });
});

app.get("/products/:id/options/:optionId", function (req, res) {
  var sql = "select * from productoptions where productid = ? and Id = ?";
  var params = [req.params.id, req.params.optionId];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows[0]);
  });
});

app.put("/products/:id/options/:optionId", function (req, res) {
  var sql =
    "UPDATE productoptions SET Name = ?, Description = ? WHERE ProductId = ? AND Id = ? ";
  var params = [
    req.body.Name,
    req.body.Description,
    req.params.id,
    req.params.optionId,
  ];

  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    var updatedOption = Object.assign(
      { Id: req.params.optionId, ProductId: req.params.id },
      req.body
    );
    res.json(updatedOption);
  });
});

app.delete("/products/:id/options/:optionId", function (req, res) {
  var sql = "DELETE FROM productoptions WHERE ProductId = ? AND Id = ? ";
  var params = [req.params.id, req.params.optionId];

  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json("Product option " + req.params.optionId + " deleted successfully");
  });
});

app.listen(port, () => {
  console.log(`Refactored app listening at http://localhost:${port}`);
});
