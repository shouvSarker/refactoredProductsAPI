'use strict';

const osprey = require('osprey');

function ospreyMiddleware(pathToRamlFile, options = {}) {
  let promise;
  // eslint-disable-next-line no-param-reassign
  options.disableErrorInterception = true;
  // eslint-disable-next-line no-param-reassign
  options.server = options.server || {};
  // eslint-disable-next-line no-param-reassign
  options.server.limit = options.server.limit || '400kb';

  // eslint-disable-next-line no-return-assign
  return (req, res, next) => (
    (promise || (promise = osprey.loadFile(pathToRamlFile, options)))
      .then((middleware) => middleware(req, res, next))
      .catch(next)
  );
}

module.exports = ospreyMiddleware;
