import Direction, { char as dChar } from "./Direction";

export default class Position {
	x: number;
	y: number;

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	equal(pos) {
		return pos.x === this.x && pos.y === this.y;
	}

	toString(){
		return `{${this.x}, ${this.y}}`;
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

	/**
	 * Get x distance to target pos.
	 * @param x
	 * @returns positive value if target is on the right side of this point
	 */
	distanceX(x: number) {
		return x - this.x;
	}

	/**
	 * Get y distance to target pos.
	 * @param y
	 * @returns positive value if target is on the bottom side of this point
	 */
	distanceY(y: number) {
		return y - this.y;
	}

	toMove(pos: Position) {

    }
}
