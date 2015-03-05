'use strict';

var assert = require("assert");
var CPU = require('../../client/cpu');

var FAKE = 0xFF;

module.exports = function() {

  describe('Test registers', function() {

    describe('Reset', function() {

      var cpu = new CPU();

      // Mess a bit with all registers
      cpu.registers.a = FAKE;
      cpu.registers.b = FAKE;
      cpu.registers.c = FAKE;
      cpu.registers.d = FAKE;
      cpu.registers.e = FAKE;
      cpu.registers.h = FAKE;
      cpu.registers.l = FAKE;
      cpu.registers.f = FAKE;
      cpu.registers.pc = FAKE;
      cpu.registers.sp = FAKE;
      cpu.registers.m = FAKE;
      cpu.registers.t = FAKE;

      // Reset them
      cpu.registers.reset();

      it('All registers should have 0', function() {
        assert.equal(0, cpu.registers.a);
  			assert.equal(0, cpu.registers.b);
  			assert.equal(0, cpu.registers.c);
  			assert.equal(0, cpu.registers.d);
  			assert.equal(0, cpu.registers.e);
  			assert.equal(0, cpu.registers.h);
  			assert.equal(0, cpu.registers.l);
  			assert.equal(0, cpu.registers.f);
  			assert.equal(0, cpu.registers.pc);
  			assert.equal(0, cpu.registers.sp);
  			assert.equal(0, cpu.registers.m);
  			assert.equal(0, cpu.registers.t);
      })

    });

  })

};
