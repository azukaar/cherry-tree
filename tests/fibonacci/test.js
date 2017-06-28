'use strict';

var _cherryModuleSystem = require('cherry-module-system');

function fib(limit, a, b) {
  if (limit > 1) {
    return (0, _cherryModuleSystem.sum)(fib(limit - 1, b, a + b));
  } else {
    return b;
  }
};function start() {
  return (0, _cherryModuleSystem.puts)(fib(10, 0, 1));
};start();