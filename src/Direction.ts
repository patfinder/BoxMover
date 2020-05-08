
const enum Direction {
    Left,
    Right,
    Up,
    Down
}

export default Direction;

// ============================================================

export function char(dir: Direction) {
    if (dir === Direction.Left) return 'L';
    if (dir === Direction.Right) return 'R';
    if (dir === Direction.Up) return 'T';
    if (dir === Direction.Down) return 'B';

    return '';
}
