#!/usr/bin/node

const raml = require("raml-1-parser");
const api = raml.loadSync("definition.raml");

if (api.errors && api.errors.length > 0) {
  api.errors.forEach((error) => {
    console.error(JSON.stringify(error, null, 2));
  });
  throw "RAML is not valid.";
}

console.log(JSON.stringify(api, null, 2));
