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
