'use strict';

module.exports = function(registers, mmu, instructions, map) {

  return {

    // Time clock: The Z80 holds two types of clock (m and t)
    clock: {m:0, t:0},

    // Register set
    registers: registers,
    mmu: mmu,
    instructions: instructions,
    map: map,

    reset: function() {
    	this.registers.reset();
    	this.clock.m = 0;
    	this.clock.t = 0;
    },

    dispatch: function() {
    	while(true) {
    		var op = MMU.rb(this.registers.pc++);              // Fetch instruction
		    this.map[op](this);                          // Dispatch
		    this.registers.pc &= 0xFFFF;                        // Mask PC to 16 bits
		    this.clock.m += this.registers.m;                  // Add time to CPU clock
		    this.clock.t += this.registers.t;
    	}
    },

    execOpcode: function(opcode) {
      this.map[opcode](this);
    }

  }

};
