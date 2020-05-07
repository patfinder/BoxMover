
const CellState = {
	// Low nibble
	Blank: 0x01,
	Hole:  0x02,
	// High nible
	Wall:  0x10,
	Box:   0x20,
	// Man:   0x40,

	// Get Blank or Hole part
	BaseNib: 0x0F,
	// Get Wall, Box, Man part
	ObjNib: 0xF0,
};

const Direction = {
	Left:	0x01,
	Right:	0x02,
	Top:	0x10,
	Bottom: 0x20,

	XNib: 0x0F,
	YNib: 0xF0,
}

/**
 * Get next pos of specified pos
 * @param {Pos} pos current pos
 * @param {any} dir move direction
 */
function nextCell(pos, dir) {
	var dx = 0, dy = 0;
	if (dir & Direction.XNibble) {
		dx = dir & Direction.Left ? -1 : 1;
	}
	else {
		dy = dir & Direction.Top ? -1 : 1;
	}

	return new Pos(pox.x + dx, pos.y + dy);
}

class Pos {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	equal(pos) {
		return pos.x === this.x && pos.y === this.y;
    }
}

class Board {

	/**
	 * Note: x = 0: top, y = 0: left
	 */

	/**
	 * 
	 * @param {any} width
	 * @param {any} height
	 * @param {Pos} manPos Man's initial position
	 */
	constructor(width, height, manPos) {
		this.height = height;
		this.width = width;

		// Array of [column][row]
		this.cells = new Array(width);
		for (var x = 0; x < width; x++) {
			this.cells[x] = new Array(height);
		}

		this.boxCount = 0;
		// Man position
		this.x = manPos.x;
		this.y = manPos.y;
	}

	/**
	 * Initialize cell value
	 * @param {Pos} pos cell position
	 * @param {CellState} state
	 */
	initCell(pos, state) {
		var { x, y } = pos;
		if (x >= this.width) throw `Invalid col value ${x}`;
		if (y >= this.height) throw `Invalid row value ${y}`;

		// TODO: check state value

		// Set box
		if (state & CellState.Box) {
			if ((this.cells[x][y] & CellState.Box) === 0) this.boxCount++;
		}
		else {
			// Clear box
			if (this.cells[x][y] & CellState.Box) this.boxCount--;
		}

		this.cells[x][y] = state;
	}

	/**
	 * Check if a cell is empty (empty on high nibble)
	 * @param {any} pos
	 */
	isEmpty(pos) {
		var { x, y } = pos;
		return (this.cells[x][y] & CellState.ObjNib) === 0;
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
		var poss = [];

		// Directions for selecting a move
		var dirs = [Direction.Left, Direction.Right, Direction.Top, Direction.Bottom];
		while (found) {
			let nextPos = this.findMove(poss);
        }
	}

	/**
	 * Find a cell adjacent cell that can move.
	 * @param {[Pos]} poss current cells in the area
	 * @returns {Pos} next movable position
	 */
	findMove(poss) {
		var dirs = [Direction.Left, Direction.Right, Direction.Top, Direction.Bottom];

		// For each of current cells, check if adjacent cells can move
		for (let i = 0; i < poss.length; i++) {
			let pos = poss[i];

			// Loop on dirs
			for (let j = 0; j < 4; j++) {
				let dir = dirs[j];
				let nextPos = nextCell(pos, dir);
				if (this.isEmpty(nextPos) && poss.every(p => !nextPos.equal(p))) return nextPos;
			}
        }
    }
}
