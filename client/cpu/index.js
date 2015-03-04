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
