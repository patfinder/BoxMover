import Direction, { char as dChar } from "./Direction";

export function id(pos: Point): string {
    return `${pos.x}-${pos.y}`
}

export function idFromXY(x: number, y: number): string {
    return `${x}-${y}`
}

export function parseId(id: string): string[] {
    if (!id) return [];
    return id.split('-');
}

export default class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `{${this.x}, ${this.y}}`;
    }

    get id() {
        return id(this);
    }

    get left() {
        const { x, y } = this;

        if (y <= 0) return undefined;

        return new Point(x, y - 1);
    }

    get right() {
        const { x, y } = this;
        return new Point(x, y + 1);
    }

    get top() {
        const { x, y } = this;

        if (x <= 0) return undefined;

        return new Point(x - 1, y);
    }

    get bottom() {
        const { x, y } = this;
        return new Point(x + 1, y);
    }

    equal = (pos: Point) => pos.x === this.x && pos.y === this.y;

	/**
	 * Get next pos of specified pos
	 * @param {Direction} dir move direction
	 */
    adjacent(dir: Direction) {
        const { x, y } = this;
        let dx = 0, dy = 0;

        if (dir === Direction.Left || dir === Direction.Right) {
            dx = dir === Direction.Left ? -1 : 1;
        }
        else if (dir === Direction.Up || dir === Direction.Down) {
            dy = dir === Direction.Up ? -1 : 1;
        }
        else throw `Invalid dir ${dChar(dir)}`;

        return new Point(x + dx, y + dy);
    }
}
