# Osprey middleware

An Express middleware for Osprey

## Install

As an npm package

```
npm install osprey-middleware
```

## Usage

```js
var ospreyMiddleware = require('osprey-middleware');
var express = require('express');

express.Router().use(ospreyMiddleware(ramlPath, options);
```

## License

MIT
