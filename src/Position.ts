import Direction, { char as dChar } from "./Direction";

export function id(pos: Position) {
	return `${pos.x}-${pos.y}`
}

export function idFromXY(x: number, y: number) {
	return `${x}-${y}`
}

export default class Position {
	x: number;
	y: number;

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	toString(){
		return `{${this.x}, ${this.y}}`;
	}

	get id() {
		return id(this);
    }

	equal(pos) {
		return pos.x === this.x && pos.y === this.y;
	}

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

		return new Position(x + dx, y + dy);
	}
}
