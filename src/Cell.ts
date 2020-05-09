
enum Cell {
    // Low nibble
    Blank = 0x01,
    Hole  = 0x02,
    // High nible
    Wall  = 0x10,
    Box   = 0x20,

    // Get Blank or Hole part
    BaseNibble = 0x0F,
    // Get Wall or Box part
    ObjNibbles  = 0xF0,
}

export function char0x(cell) {
    return cell.toString(16);
}

/**
 * Get representing char of cell state
 * @param {Cell} value
 */
export function char(cell: Cell) {
    const value = cell;

    if (value & Cell.Wall) return 'H';
    // if (value & Wall) return String.fromCharCode(219);
    if (value & Cell.Box) return 'X';
    // Occupied Hole
    if (value & Cell.Box && value & Cell.Hole) {
        return '#';
    }
    if (value & Cell.Hole) return 'O';
    if (value & Cell.Blank) return ' ';

    // Error
    return undefined;
}

export function isValidState(cell: Cell) {

    // Not Blank & Hole at the same time
    if (cell & Cell.Blank && cell & Cell.Hole) return false;

    // Not Wall & Box at the same time
    if (cell & Cell.Wall && cell & Cell.Box) return false;

    // How about Wall & Hole?
    // Maybe its valid but unsolvable

    return true;
}

export default Cell;
