
// Low nibble
export const BlankFlag = 0x01;
export const HoleFlag  = 0x02;
// High nible
export const WallFlag  = 0x10;
export const BoxFlag   = 0x20;
// Man:   0x40,

// Get Blank or Hole part
const BaseNibFlags = 0x0F;
// Get Wall, Box, Man part
const ObjNibFlags  = 0xF0;

export default class Cell {

    constructor(value) {
        this.value = value;
    }

    copy() {
        return new Cell(this.value);
    }

    get isBlank() { return Boolean(this.value & BlankFlag); }
    get isHole() { return Boolean(this.value & HoleFlag); }
    get isWall() { return Boolean(this.value & WallFlag); }
    get isBox() { return Boolean(this.value & BoxFlag); }

    char0x() {
        return this.value.toString(16);
    }

    /**
     * Get representing char of cell state
     * @param {Cell} value
     */
    get char() {
        var value = this.value;

        if (value & WallFlag)  return 'H';
        // if (value & WallFlag) return String.fromCharCode(219);
        if (value & BoxFlag) return 'X';
        // Occupied Hole
        if (value & BoxFlag && value & HoleFlag) {
            return '#';
        }
        if (value & HoleFlag) return 'O';
        if (value & BlankFlag) return ' ';

        // TODO: what about Man & Hole ?
        return undefined;
    }

    get isValidState() {

        if (this.isBlank && this.isHole) return false;

        if (this.isWall && this.isBox) return false;

        return true;
    }

    get BaseNib() { return this.value & BaseNibFlags; }
    get ObjNib() {  return this.value & ObjNibFlags; }
}
