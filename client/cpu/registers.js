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
