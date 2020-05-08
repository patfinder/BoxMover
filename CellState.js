
// Low nibble
const Blank = 0x01;
const Hole  = 0x02;
// High nible
const Wall  = 0x10;
const Box   = 0x20;
// Man:   0x40,

// Get Blank or Hole part
const BaseNib = 0x0F;
// Get Wall, Box, Man part
const ObjNib  = 0xF0;

export default class Cell {

    constructor(value) {
        this.value = value;
    }

    copy(cell) {
        return new Cell(cell.value);
    }

    /**
     * Get representing char of cell state
     * @param {Cell} value
     */
    cellChar() {
        var value = this.value;

        if (value & Cell.Wall)  return 'H';
        if (value & Cell.Box)   return 'X';
        if (value & Cell.Box && value & Cell.Hole) {
            return '0';
        }
        if (value & Cell.Hole)  return 'O';
        if (value & Cell.Blank) return ' ';

        // TODO: what about Man & Hole ?
        return undefined;
    }

    // Low nibble
    static get Blank() { return Blank; }
    static get Hole() { return Hole; }
    // High nible
    static get Wall() { return Wall; }
    static get Box() { return Box; }

    static get BaseNib() { return BaseNib; }
    static get ObjNib() { return ObjNib; }
}
