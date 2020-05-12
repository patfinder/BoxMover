
const enum Direction {
    Left    = 0x04,
    Right   = 0x05,
    Top     = 0x40,
    Bottom  = 0x50,

    // Get Blank or Hole part
    XNibble = 0x0F,
    // Get Wall or Box part
    YNibble = 0xF0,
}

export default Direction;

// ============================================================

export function char(dir: Direction) {
    if (dir === Direction.Left) return 'L';
    if (dir === Direction.Right) return 'R';
    if (dir === Direction.Top) return 'T';
    if (dir === Direction.Bottom) return 'B';

    return '';
}
