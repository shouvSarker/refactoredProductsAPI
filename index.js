const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const routes = require("./route.js");

app.use(bodyParser.json());
app.use("/v1", routes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = app;

// app.listen(port, () => {
//   //console.log(`Refactored app listening at http://localhost:${port}`);
// });
