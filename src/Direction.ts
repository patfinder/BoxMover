
const enum Direction {
    Left    = 0x03,
    Right   = 0x0C,
    Top     = 0x30,
    Bottom  = 0xC0,

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

    throw `Invalid direction ${dir}`;
}

export function opposite(dir: Direction) {
    if (dir === Direction.Left) return Direction.Right;
    if (dir === Direction.Right) return Direction.Left;
    if (dir === Direction.Top) return Direction.Bottom;
    if (dir === Direction.Bottom) return Direction.Top;

    throw `Invalid direction ${dir}`;
}
