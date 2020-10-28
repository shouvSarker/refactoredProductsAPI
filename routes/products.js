var express = require("express");
const ospreyMiddleware = require("osprey-middleware");
var router = express.Router();
const helpers = require("./helpers");

// middleware to validate requests against raml
router.use(ospreyMiddleware("raml/api.raml"));

router.get("/products", function (req, res) {
  const db = helpers.database();
  if (req.query.name != undefined) {
    const sql = "select * from products where Name = ? ";
    const params = [req.query.name];
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
    const sql = "select * from products";
    const params = [];
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
  db.close();
});

router.post("/products", function (req, res) {
  const db = helpers.database();
  const sql =
    "INSERT INTO products (Id, Name, Description, Price, DeliveryPrice) VALUES (?,?,?,?,?) ";
  const newId = helpers.uuid();
  const params = [
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
    const insertedProduct = Object.assign({ id: newId }, req.body);
    res.status(201).json(insertedProduct);
  });
  db.close();
});

router.get("/products/:id", function (req, res) {
  const db = helpers.database();
  const sql = "select * from products where Id = ? ";
  const params = [req.params.id];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows[0]);
  });
  db.close();
});

router.put("/products/:id", function (req, res) {
  const db = helpers.database();
  const sql =
    "UPDATE products SET Name = ?, Description = ?, Price = ?, DeliveryPrice = ? WHERE Id = ? ";
  const params = [
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
    const updatedProduct = Object.assign({ id: req.params.id }, req.body);
    res.json(updatedProduct);
  });
  db.close();
});

router.delete("/products/:id", function (req, res) {
  const db = helpers.database();
  const sql = "DELETE FROM products WHERE Id = ? ";
  const params = [req.params.id];

  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json("Product " + req.params.id + " deleted successfully");
  });
  db.close();
});

router.get("/products/:id/options", function (req, res) {
  const db = helpers.database();
  const sql = "select * from productoptions where productid = ? ";
  const params = [req.params.id];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      Items: rows,
    });
  });
  db.close();
});

router.post("/products/:id/options", function (req, res) {
  const db = helpers.database();
  const sql =
    "INSERT INTO productoptions (Id, ProductId, Name, Description) VALUES (?,?,?,?) ";
  const optionId = helpers.uuid();
  const params = [optionId, req.params.id, req.body.Name, req.body.Description];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    const insertedOption = Object.assign(
      { Id: optionId, ProductId: req.params.id },
      req.body
    );
    res.status(201).json(insertedOption);
  });
  db.close();
});

router.get("/products/:id/options/:optionId", function (req, res) {
  const db = helpers.database();
  const sql = "select * from productoptions where productid = ? and Id = ?";
  const params = [req.params.id, req.params.optionId];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows[0]);
  });
  db.close();
});

router.put("/products/:id/options/:optionId", function (req, res) {
  const db = helpers.database();
  const sql =
    "UPDATE productoptions SET Name = ?, Description = ? WHERE ProductId = ? AND Id = ? ";
  const params = [
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
    const updatedOption = Object.assign(
      { Id: req.params.optionId, ProductId: req.params.id },
      req.body
    );
    res.json(updatedOption);
  });
  db.close();
});

router.delete("/products/:id/options/:optionId", function (req, res) {
  const db = helpers.database();
  const sql = "DELETE FROM productoptions WHERE ProductId = ? AND Id = ? ";
  const params = [req.params.id, req.params.optionId];

  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json("Product option " + req.params.optionId + " deleted successfully");
  });
  db.close();
});

module.exports = router;
