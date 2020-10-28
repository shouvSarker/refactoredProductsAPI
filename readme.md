## Refactored-solution
The attached project is a refactor of products API originally written in C#. The project is developed with nodejs express, with osprey middleware. raml2html package has been used to generate API documentation from raml definition. The middleware will validate every request against the specified raml and send it to the server or respond with an error code. The product was developed with an API-led approach.

## How to
* The server can be started with `npm start` or with `npm run start-dev` to start it in development mode.
* The tests can be run with `npm test`. There is also a raml validator that can be run with `npm run raml-validate`.
* http://localhost:3000/ will display the API documentation. Requests can be sent to http://localhost:3000/v1/path to query the API server.

### Paths

All paths must preceed with http://localhost:3000/v1:

1. `GET /products` - gets all products.
2. `GET /products?name={name}` - finds all products matching the specified name.
3. `GET /products/{id}` - gets the project that matches the specified ID - ID is a GUID.
4. `POST /products` - creates a new product.
5. `PUT /products/{id}` - updates a product.
6. `DELETE /products/{id}` - deletes a product and its options.
7. `GET /products/{id}/options` - finds all options for a specified product.
8. `GET /products/{id}/options/{optionId}` - finds the specified product option for the specified product.
9. `POST /products/{id}/options` - adds a new product option to the specified product.
10. `PUT /products/{id}/options/{optionId}` - updates the specified product option.
11. `DELETE /products/{id}/options/{optionId}` - deletes the specified product option.

All data types are specified in the raml definition within the `/raml` folder in root directory. They conform to the following format:

**Product:**
```
{
  "Id": "01234567-89ab-cdef-0123-456789abcdef",
  "Name": "Product name",
  "Description": "Product description",
  "Price": 123.45,
  "DeliveryPrice": 12.34
}
```

**Products:**
```
{
  "Items": [
    {
      // product
    },
    {
      // product
    }
  ]
}
```

**Product Option:**
```
{
  "Id": "01234567-89ab-cdef-0123-456789abcdef",
  "Name": "Product name",
  "Description": "Product description"
}
```

**Product Options:**
```
{
  "Items": [
    {
      // product option
    },
    {
      // product option
    }
  ]
}
```

## Quick walkthrough code structure
* `App_data/`: Folder with sqlite database files.
* `raml/`: Folder containing all raml and type definition files including examples.
* `routes/`: Has all the routes and helper functions.
* `index.html`: HTML page generated from raml definition. Displays the raml contract.
* `start.js`: To start the api server.
* `server.js`: Is called in start.js and works as a glue between the routes and start.js.
* `tests/`: Folder containing jest tests including raml validator. Also contains fixtures.
