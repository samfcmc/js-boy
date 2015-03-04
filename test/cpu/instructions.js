'use strict';

var assert = require("assert");
var CPU = require('../../client/cpu');

module.exports = function() {
  describe('Test instruction set', function() {
    describe('NOP', function() {

      var cpu = new CPU();

      cpu.instructions.NOP(cpu);

      it('all registers should have zero', function() {
        assert.equal(0, cpu.registers.a);
        assert.equal(0, cpu.registers.b);
        assert.equal(0, cpu.registers.c);
        assert.equal(0, cpu.registers.d);
        assert.equal(0, cpu.registers.e);
        assert.equal(0, cpu.registers.h);
        assert.equal(0, cpu.registers.l);
        assert.equal(0, cpu.registers.f);
      });

      it('m register should have 1', function() {
        assert.equal(1, cpu.registers.m);
      });

      it('t register should have 4', function() {
        assert.equal(4, cpu.registers.t);
      });

    });
  });
};
