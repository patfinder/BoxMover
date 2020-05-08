import { Left, Right, Top, Bottom } from "./Direction";

export default class Position {
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
	 * @param {Left|Right|Top|Bottom} dir move direction
	 */
	adjacent(dir) {
		var { x, y } = this;
		var dx = 0, dy = 0;
		if (dir.isX) {
			dx = dir.isLeft ? -1 : 1;
		}
		else if (dir.isY) {
			dy = dir.isTop ? -1 : 1;
		}
		else throw `Invalid dir ${dir.char}`;

		var newPos = new Position(x + dx, y + dy);
		if (this.isInBoard(newPos)) {
			return newPos;
		}

		return undefined;
	}
}
