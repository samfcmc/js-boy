(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/samuel/dev/projects/js-boy/client/cpu/cpu.js":[function(require,module,exports){
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


},{"./instructions":"/home/samuel/dev/projects/js-boy/client/cpu/instructions.js","./map":"/home/samuel/dev/projects/js-boy/client/cpu/map.js","./mmu":"/home/samuel/dev/projects/js-boy/client/cpu/mmu.js","./registers":"/home/samuel/dev/projects/js-boy/client/cpu/registers.js"}],"/home/samuel/dev/projects/js-boy/client/cpu/index.js":[function(require,module,exports){
'use strict';


var CPU = require('./cpu');

module.exports = CPU;

},{"./cpu":"/home/samuel/dev/projects/js-boy/client/cpu/cpu.js"}],"/home/samuel/dev/projects/js-boy/client/cpu/instructions.js":[function(require,module,exports){
'use strict';

module.exports =  {
	// Add E to A, leaving result in A (ADD A, E)
    ADDr_e: function(cpu) {
        cpu.registers.a += cpu.registers.e;                      // Perform addition
        cpu.registers.f = 0;                              // Clear flags
        if(!(cpu.registers.a & 255)) cpu.registers.f |= 0x80;    // Check for zero
        if(cpu.registers.a > 255) cpu.registers.f |= 0x10;       // Check for carry
        cpu.registers.a &= 255;                           // Mask to 8-bits
        cpu.registers.m = 1; cpu.registers.t = 4;                // 1 M-time taken
    },

    // Compare B to A, setting flags (CP A, B)
    CPr_b: function(cpu) {
        var i = cpu.registers.a;                          // Temp copy of A
        i -= cpu.registers.b;                             // Subtract B
        cpu.registers.f |= 0x40;                          // Set subtraction flag
        if(!(i & 255)) cpu.registers.f |= 0x80;           // Check for zero
        if(i < 0) cpu.registers.f |= 0x10;                // Check for underflow
        cpu.registers.m = 1; cpu.registers.t = 4;                // 1 M-time taken
    },

    // No-operation (NOP)
    NOP: function(cpu) {
        cpu.registers.m = 1; cpu.registers.t = 4;                // 1 M-time taken
    },

    // Push registers B and C to the stack (PUSH BC)
    PUSHBC: function(cpu) {
        cpu.registers.sp--;                               // Drop through the stack
		mmu.wb(cpu.registers.sp, cpu.registers.b);               // Write B
		cpu.registers.sp--;                               // Drop through the stack
		mmu.wb(cpu.registers.sp, cpu.registers.c);               // Write C
		cpu.registers.m = 3; cpu.registers.t = 12;               // 3 M-times taken
    },

    // Pop registers H and L off the stack (POP HL)
    POPHL: function(cpu) {
        cpu.registers.l = cpu.mmu.rb(cpu.registers.sp);              // Read L
		cpu.registers.sp++;                               // Move back up the stack
		cpu.registers.h = cpu.mmu.rb(cpu.registers.sp);              // Read H
		cpu.registers.sp++;                               // Move back up the stack
		cpu.registers.m = 3; cpu.registers.t = 12;               // 3 M-times taken
    },

    // Read a byte from absolute location into A (LD A, addr)
    LDAmm: function(cpu) {
        var addr = mmu.rw(cpu.registers.pc);              // Get address from instr
		cpu.registers.pc += 2;                            // Advance PC
		cpu.registers.a = cpu.mmu.rb(addr);                   // Read from address
		cpu.registers.m = 4; cpu.registers.t=16;                 // 4 M-times taken
    }
};

},{}],"/home/samuel/dev/projects/js-boy/client/cpu/map.js":[function(require,module,exports){
'use strict';

/*
 * Mapping between instructions and opcodes
 */

module.exports = function(instructions) {

	return [
		instructions.NOP,
	    instructions.LDBCnn,
	    instructions.LDBCmA,
	    instructions.INCBC,
	    instructions.INCr_b,
	];

};

},{}],"/home/samuel/dev/projects/js-boy/client/cpu/mmu.js":[function(require,module,exports){
'use strict';

/*
 * Memory Management Unit
 */

module.exports = {
	// Read Byte (8 bits)
	rb: function(addr) {
		//TODO:
	},

	// Read Word (16 bits)
	rw: function(addr) {
		//TODO:
	},

	// Write Byte (8 bits)
	wb: function(addr) {
		//TODO:
	},

	// Write word (8 bits)
	ww: function(addr) {
		//TODO:
	}
};

},{}],"/home/samuel/dev/projects/js-boy/client/cpu/registers.js":[function(require,module,exports){
'use strict';

var Registers = function() {
	return {
		a:0, 
        b:0, 
        c:0, 
        d:0, 
        e:0, 
        h:0, 
        l:0, 
        f:0,    // 8-bit registers
        pc:0, 
        sp:0,  	// 16-bit registers
        m:0, 
        t:0     // Clock for last instr
	}
        
};

module.exports = Registers;
},{}],"/home/samuel/dev/projects/js-boy/client/main.js":[function(require,module,exports){
'use strict';

var CPU = require('./cpu');

console.log('test');

window.CPU = CPU;

},{"./cpu":"/home/samuel/dev/projects/js-boy/client/cpu/index.js"}]},{},["/home/samuel/dev/projects/js-boy/client/main.js"]);
