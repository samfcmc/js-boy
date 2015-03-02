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