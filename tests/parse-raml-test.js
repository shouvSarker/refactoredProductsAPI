#!/usr/bin/node

const raml = require("raml-1-parser");
// the path is from root directory as the validation script is run from root
const api = raml.loadSync("raml/api.raml");

if (api.errors && api.errors.length > 0) {
  api.errors.forEach((error) => {
    console.error(JSON.stringify(error, null, 2));
  });
  throw "RAML is not valid.";
}

console.log("RAML is valid");
