var assert = require("assert");
var CPU = require('../client/cpu');

describe('Test instruction set', function() {
  describe('NOP', function() {

    CPU.instructions.NOP(CPU);

    it('all registers should have zero', function() {
      assert.equal(0, CPU.registers.a);
      assert.equal(0, CPU.registers.b);
      assert.equal(0, CPU.registers.c);
      assert.equal(0, CPU.registers.d);
      assert.equal(0, CPU.registers.e);
      assert.equal(0, CPU.registers.h);
      assert.equal(0, CPU.registers.l);
      assert.equal(0, CPU.registers.f);
    });

    it('m register should have 1', function() {
      assert.equal(1, CPU.registers.m);
    });

    it('t register should have 4', function() {
      assert.equal(4, CPU.registers.t);
    });

  });
});
