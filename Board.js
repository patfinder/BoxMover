import CellState from './CellState';
import Direction from './Direction';
import Position from './Position';

export class Board {

	/**
	 * Note: x = 0: top, y = 0: left
	 */

	/**
	 * 
	 * @param {any} width
	 * @param {any} height
	 * @param {Position} manPos Man's initial position
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
		this.pos = new Position(manPos.x, manPos.y);
	}

	/**
	 * Initialize cell value
	 * @param {Position} pos cell position
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

		var newPos = new Position(pox.x + dx, pos.y + dy);
		var { x, y } = newPos;

		if (x >= 0 && x < this.width && y >= 0 && y < this.height) return nextPos;

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

	/**
	 * Check if Man can move to specified position.
	 * True if there is a path between Man's pos and the position.
	 * @param {pos} pos
	 */
	canMove(pos) {
		// No move
		if (this.manPos.equal(pos)) return true;

		// Find all adjacent positions
		// Brute Force algorithm
		var poss = [this.manPos];

		for (; ;) {
			let nextPos = this.findMove(poss);
			if (nextPos === undefined) return false;

			// Reach the pos
			if (nextPos.equal(pos)) return true;

			// Add pos, continue searching
			pos.push(nextPos);
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
