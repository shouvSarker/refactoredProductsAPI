const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const routes = require("./routes/products.js");

app.use(bodyParser.json());
app.use("/v1", routes);

app.get("/", (req, res) => {
  // display the html page generated from raml contract
  res.sendFile(__dirname + "/index.html");
});

module.exports = app;
