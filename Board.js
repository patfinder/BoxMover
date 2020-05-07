import CellState from './CellState';
import Direction from './Direction';
import Position from './Position';

/**
 * Get representing char of cell state
 * @param {CellState} cellState
 */
export function cellChar(cellState) {
	if (cellState & CellState.Wall)  return 'H';
	if (cellState & CellState.Box)   return 'X';
	if (cellState & CellState.Hole)  return 'O';
    if (cellState & CellState.Blank) return ' ';

	return undefined;
}

export default class Board {

	/**
	 * Note: x = 0: top, y = 0: left
	 */

	/**
	 * 
	 * @param {any} X
	 * @param {any} Y
	 * @param {Position} manPos Man's initial position
	 */
	constructor(X, Y, manPos) {
		this.X = X;
		this.Y = Y;

		// X: first index, Y: second index
		this.cells = new Array(X);
		for (var x = 0; x < X; x++) {
			this.cells[x] = new Array(Y);
		}

		this.boxCount = 0;
		// Man position
		this.manPos = new Position(manPos.x, manPos.y);
	}

	/**
	 * Initialize cell value
	 * @param {Position} pos cell position
	 * @param {CellState} state
	 */
	initCell(pos, state) {
		var { x, y } = pos;
		if (x >= this.X) throw `Invalid x value ${x}`;
		if (y >= this.Y) throw `Invalid y value ${y}`;

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
	 * Initialize board
	 * @param {CellState[x][y]} board of cell states
	 */
	initBoard(board) {
		for (let x = 0; x < board.length; x++) {
			for (let y = 0; y < board[x].length; y++) {
				this.initCell(new Position(x, y), board[x][y]);
            }
        }
	}

	validate() {
		// TODO: validate if board is valid
		// Box count = Hole count
		// Man position is in the board
    }

	/**
	 * Get next pos of specified pos
	 * @param {Position} pos current pos
	 * @param {any} dir move direction
	 */
	nextCell(pos, dir) {
		var dx = 0, dy = 0;
		if (dir & Direction.XNibble) {
			dx = dir & Direction.Left ? -1 : 1;
		}
		else {
			dy = dir & Direction.Top ? -1 : 1;
		}

		var x = pos.x + dx, y = pos.y + dy;
		if (x >= 0 && x < this.X && y >= 0 && y < this.Y) {
			return new Position(x, y);
		}

		return undefined;
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

	print() {
		for (let x = 0; x < this.X; x++) {
			let row = '';
			for (let y = 0; y < this.Y; y++) {
				if (new Position(x, y).equal(this.manPos)) row += 'M';
				else row += cellChar(this.cells[x][y]);
			}
			console.log(row);
        }
    }

	/**
	 * Check if Man can move to specified position.
	 * True if there is a path between Man's pos and the position.
	 * @param {pos} pos
	 */
	canMove(pos) {
		// No move
		if (this.manPos.equal(pos)) return true;

		// Find all adjacent positions
		var zone = [this.manPos];

		for (; ;) {
			let nextPos = this.findMove(zone);

			// Cannot find new pos
			if (nextPos === undefined) return false;

			// Reach the pos
			if (nextPos.equal(pos)) return true;

			// Expand zone to newPos, continue searching
			zone.push(nextPos);
		}
	}

	/**
	 * Find a cell adjacent to cells that can move
	 * @param {[Position]} poss current cells in the zone
	 * @returns {Position} next movable position
	 */
	findMove(poss) {
		var dirs = [Direction.Left, Direction.Right, Direction.Top, Direction.Bottom];

		// For each of current cells, check if adjacent cells can walk
		for (let i = 0; i < poss.length; i++) {
			let pos = poss[i];

			// Loop on dirs
			for (let j = 0; j < 4; j++) {
				let dir = dirs[j];

				let nextPos = this.nextCell(pos, dir);
				if (nextPos === undefined) continue;

				// Check if pos is walked
				if (this.isEmpty(nextPos) && poss.every(p => !nextPos.equal(p))) {
					return nextPos;
				}
			}
        }
    }
}
