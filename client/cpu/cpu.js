'use strict';

var Registers = require('./registers');
var Instructions = require('./instructions');
var MMU = require('./mmu');
var Map = require('./map');

var CPU = {
    // Time clock: The Z80 holds two types of clock (m and t)
    clock: {m:0, t:0},

    // Register set
    registers: new Registers(),
    mmu: MMU,
    map: Map(Instructions),

    reset: function() {
    	this.registers = new Registers();
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

};

module.exports = CPU;

