
const CellState = {
	// Low nibble
	Blank: 0x00,
	Hole:  0x01,
	// High nible
	Wall:  0x10,
	Box:   0x20,
	// Man:   0x40,

	LNibble: 0x0F,
	HNibble: 0xF0,
};

const Direction = {
	Left: 0,
	Right: 1,
	Top: 2,
	Bottom: 3,
}

/**
 * Find next cell of specified cell
 * @param {any} x
 * @param {any} y
 * @param {any} dir dir relating to current position.
 */
function nextCell(x, y, dir) {

}

class Pos {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	eq(pos) {
		return pos.x === this.x && pos.y === this.y;
    }
}

class Board {

	/**
	 * 
	 * @param {any} width
	 * @param {any} height
	 * @param {Pos} manPos Man's initial position
	 */
	constructor(width, height, manPos) {
		this.height = height;
		this.width = width;

		// Array of [row][column]
		this.cells = new Array(height);
		for (var i = 0; i < height; i++) {
			this.cells[i] = new Array(width);
		}

		this.boxCount = 0;
		// Man position
		this.x = manPos.x;
		this.y = manPos.y;
	}

	/**
	 * Initialize cell value 
	 * @param {Number} x
	 * @param {Number} y
	 * @param {CellState} state
	 */
	initCell(x, y, state) {
		if (y >= this.height) throw `Invalid row value ${y}`;
		if (x >= this.width) throw `Invalid col value ${x}`;

		// TODO: check state value

		// Set box
		if (state & CellState.Box) {
			if (this.cells[y][x] & CellState.Box === 0) this.boxCount++;
		}
		else {
			// Clear box
			if (this.cells[y][x] & CellState.Box) this.boxCount--;
		}

		this.cells[y][x] = state;
	}

	/**
	 * Check if a cell is empty (Zero on high nibble)
	 * @param {any} pos
	 */
	isEmpty(pos) {
		return this.cells[pos.x][pos.y] & CellState.HNibble === 0;
    }

	/**
	 * Check if two board are equal
	 * @param {any} board2
	 */
	isEqual(board2) {
		// TODO
		//return this.boxCount === board2.boxCount
	}

	/**
	 * Check if Man can move to specified position.
	 * True if there is a path between Man's pos and the position.
	 * @param {pos} pos
	 */
	canMove(pos) {
		var { x, y } = pos;
		// No move
		if (this.x === x && this.y === y) return true;

		// Brute Force algorithm
		var found = true;
		var cells = [];

		// Directions for selecting a move
		var dirs = [Direction.Left, Direction.Right, Direction.Top, Direction.Bottom];
		while (found) {
			// Try 1 of 4 dirs
			for (let d = 0; d < 4; d++) {

            }
        }
	}

	/**
	 * Find a cell adjacent cell that can move.
	 * @param {[pos]} cells current cells in the area
	 */
	findMove(cells) {

		var dirs = [Direction.Left, Direction.Right, Direction.Top, Direction.Bottom];

		// For each of current cells, check if adjacent cells can move
		for (let i = 0; i < cells.length; i++) {

			let cell = cells[i];
			for (let j = 0; j < 4; j++) {
				let dir = dirs[j];
				let nextPos = nextCell(cell.x, cell.y, dir);
				if(this.isEmpty(nextPos) && cells.every(c => c.x !== ))
			}
        }
    }
}
