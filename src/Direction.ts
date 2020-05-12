
const enum Direction {
    Left,
    Right,
    Top,
    Bottom
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
