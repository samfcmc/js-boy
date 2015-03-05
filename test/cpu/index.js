'use strict';

// Run all CPU TESTS

var instructions = require('./instructions');
var registers = require('./registers');

module.exports = function() {

  describe('Test CPU', function() {
    instructions();
    registers();
  });

};
