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
