(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/samuel/dev/projects/js-boy/client/cpu/cpu.js":[function(require,module,exports){
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

},{}],"/home/samuel/dev/projects/js-boy/client/cpu/index.js":[function(require,module,exports){
'use strict';

var Registers = require('./registers');
var Instructions = require('./instructions');
var MMU = require('./mmu');
var Map = require('./map');
var CPU = require('./cpu');

module.exports = function() {

  var registers = new Registers();
  var mmu = MMU;
  var instructions = Instructions;
  var map = Map(instructions);

  return new CPU(registers, mmu, instructions, map);

};

},{"./cpu":"/home/samuel/dev/projects/js-boy/client/cpu/cpu.js","./instructions":"/home/samuel/dev/projects/js-boy/client/cpu/instructions.js","./map":"/home/samuel/dev/projects/js-boy/client/cpu/map.js","./mmu":"/home/samuel/dev/projects/js-boy/client/cpu/mmu.js","./registers":"/home/samuel/dev/projects/js-boy/client/cpu/registers.js"}],"/home/samuel/dev/projects/js-boy/client/cpu/instructions.js":[function(require,module,exports){
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
        cpu.registers.m = 1;
        cpu.registers.t = 4;                // 1 M-time taken
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
		//0x00
		instructions.NOP,
		//0x01
	  instructions.LDBCnn,
		//0x02
  	instructions.LDBCmA,
		//0x03
	  instructions.INCBC,
		//0x04
	  instructions.INCr_b
		//TODO: Add the others
	];

};

},{}],"/home/samuel/dev/projects/js-boy/client/cpu/mmu.js":[function(require,module,exports){
'use strict';

/*
 * Memory Management Unit
 */

module.exports = {
	// Flag indicating BIOS is mapped in
  // BIOS is unmapped with the first instruction above 0x00FF
		inbios: 1,

    // Memory regions (initialised at reset time)
    bios: [],
    rom: [],
    wram: [],
    eram: [],
    zram: [],

		rb: function(cpu, address) {
			switch(address & 0xF000) {
				// BIOS (256b)/ROM0
				case 0x0000:
					if(this.inbios) {
						if(address < 0x0100) {
							return this.bios[addr];
						}
		    		else if(cpu.registers.pc == 0x0100) {
							this.inbios = 0;
						}
					}

					return this.rom[address];
				// ROM0
		    case 0x1000:
		    case 0x2000:
		    case 0x3000:
		        return this.rom[address];
				// ROM1 (unbanked) (16k)
		    case 0x4000:
		    case 0x5000:
		    case 0x6000:
		    case 0x7000:
		        return this.rom[address];
				// Graphics: VRAM (8k)
		    case 0x8000:
		    case 0x9000:
		        return GPU.vram[addr & 0x1FFF];
				// External RAM (8k)
		    case 0xA000:
		    case 0xB000:
		        return this.eram[addr & 0x1FFF];
				// Working RAM (8k)
		    case 0xC000:
		    case 0xD000:
		        return this.wram[addr & 0x1FFF];
				// Working RAM shadow
			  case 0xE000:
		        return this.wram[addr & 0x1FFF];
						// Working RAM shadow, I/O, Zero-page RAM
			    case 0xF000:
			        switch(addr & 0x0F00) {
						    // Working RAM shadow
						    case 0x000:
								case 0x100:
								case 0x200:
								case 0x300:
						    case 0x400:
								case 0x500:
								case 0x600:
								case 0x700:
						    case 0x800:
								case 0x900:
								case 0xA00:
								case 0xB00:
						    case 0xC00:
								case 0xD00:
						        return this.wram[addr & 0x1FFF];

						    // Graphics: object attribute memory
						    // OAM is 160 bytes, remaining bytes read as 0
						    case 0xE00:
						        if(addr < 0xFEA0) {
											return GPU.oam[addr & 0xFF];
										}
										else {
											return 0;
										}
						    // Zero-page
						    case 0xF00:
						        if(addr >= 0xFF80) {
							    		return MMU._zram[addr & 0x7F];
										}
										else {
										    // I/O control handling
										    // Currently unhandled
										    return 0;
										}
							}
			}

		},
		// Read a 16-bit word
    rw: function(addr) {
			return this.rb(addr) + (this.rb(addr+1) << 8);
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
    t:0,     // Clock for last instr

		reset: function() {
			this.a = 0;
			this.b = 0;
			this.c = 0;
			this.d = 0;
			this.e = 0;
			this.h = 0;
			this.l = 0;
			this.f = 0;
			this.pc = 0;
			this.sp = 0;
			this.m = 0;
			this.t = 0;
		}
	};

};

module.exports = Registers;

},{}],"/home/samuel/dev/projects/js-boy/client/main.js":[function(require,module,exports){
'use strict';

var CPU = require('./cpu');

console.log('test');

window.CPU = CPU;

},{"./cpu":"/home/samuel/dev/projects/js-boy/client/cpu/index.js"}]},{},["/home/samuel/dev/projects/js-boy/client/main.js"]);
