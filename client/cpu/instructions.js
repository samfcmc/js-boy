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
