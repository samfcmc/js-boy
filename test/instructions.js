var assert = require("assert");
var CPU = require('../client/cpu');

describe('Test instruction set', function() {
  describe('NOP', function() {
    it('all registers should have zero', function() {
      assert.equal(0, CPU.registers.a);
    });
  });
});
