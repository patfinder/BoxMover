
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
}
