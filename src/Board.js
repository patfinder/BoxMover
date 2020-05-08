import Cell from './Cell';
import { Left, Top, Right, Bottom } from './Direction';
import Position from './Position';

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
	constructor(X, Y) {
		this.X = X;
		this.Y = Y;

		// X: first index, Y: second index
		this.cells = new Array(X);
		for (var x = 0; x < X; x++) {
			this.cells[x] = new Array(Y);
		}
	}

	/**
	 * Initialize cell value
	 * @param {Position} pos cell position
	 * @param {Cell} cell
	 */
	initCell(pos, cell) {
		var { x, y } = pos;
		if (x >= this.X) throw `Invalid x value ${x}`;
		if (y >= this.Y) throw `Invalid y value ${y}`;

		// TODO: check state value

		// Set box
		// if (cell.isBox) {
		// 	if ((this.cells[x][y].isBox) === 0) this.boxCount++;
		// }
		// else {
		// 	// Clear box
		// 	if (this.cells[x][y].isBox) this.boxCount--;
		// }

		this.cells[x][y] = cell.copy();
	}

	/**
	 * Initialize board
	 * @param {Cell[x][y]} board of cell states
	 */
	initBoard(board, manPos) {

		// box count
		this.boxCount = 0;
		
		// cells
		for (let x = 0; x < this.X; x++) {
			for (let y = 0; y < this.Y; y++) {
				this.initCell(new Position(x, y), board[x][y]);
            }
		}
		
		// man pos
		this.manPos = new Position(manPos.x, manPos.y);
	}

	/**
	 * Check if a pos is in board
	 * @param {any} pos
	 */
	isInBoard(pos) {
		var { x, y } = pos;
		var { X, Y } = this;
		return x >= 0 && x < X && y >= 0 && y < Y;
    }

	/**
	 * Validate board state
	 * */
	validate() {
		var boxCount = 0;
		var holeCount = 0;
		
		// Man position is in the board
		if (!this.isInBoard(this.manPos)) {
			return `Man not in board ${this.manPos.toString()}`;
		}

		// manPos is occupied
		if (this.isOccupied(this.manPos)) {
			return `Block/Wall is at manPos ${this.manPos.toString()}`;
		}
		
		// All cell is in valid state
		for(let x=0; x<this.X; x++){
			for(let y=0; y<this.Y; y++) {
				let pos = new Position(x, y);
				let cell = this.cells[x][y];

				// Not a valid state
				if (!cell.isValidState) {
					return `Cell [${pos.toString()}] state ${cell} is invalid`;
				}

				// Box count
				if (cell.isBox) boxCount ++;

				// Hole count
				if (cell.isHole) holeCount++;
			}
		}
		
		// Box count = Hole count
		if(boxCount !== holeCount) return `Box count (${boxCount}) != Hole count (${holeCount})`;

		return false;
    }

	/**
	 * Check if a cell is empty (Blank or Hole)
	 * @param {any} pos
	 */
	isEmpty(pos) {
		var { x, y } = pos;
		return this.cells[x][y].ObjNib === 0;
	}

	/**
	 * This pos is occupied (Wall or Block)
	 * @param {any} pos
	 */
	isOccupied(pos) {
		return !this.isEmpty(pos);
    }

	/**
	 * Check if two board are equal
	 * @param {any} board2
	 */
	isEqual(board2) {
		// TODO
		//return this.boxCount === board2.boxCount
	}

	printBoard() {

		console.log(`X: ${this.X}, Y: ${this.Y} - isValid: ${this.validate()}`);
		console.log(`Man: ${this.manPos.x}, ${this.manPos.y}`);

		for (let x = 0; x < this.X; x++) {
			let row = '';
			for (let y = 0; y < this.Y; y++) {
				if (new Position(x, y).equal(this.manPos)) row += 'M';
				else row += this.cells[x][y].char;
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

			// Expand zone to newPos, continue searching
			zone.push(nextPos);

			// Reach the pos
			if (nextPos.equal(pos)) {
				return true;
			}

			console.log(`Zone: ${zone.map(p => p.toString()).join(', ')}`);
		}
	}

	/**
	 * Find a cell adjacent to cells that can move
	 * @param {[Position]} zone current cells in the zone
	 * @returns {Position} next movable position
	 */
	findMove(zone) {
		var dirs = [Left, Right, Top, Bottom];

		// For each cell in zone, check if adjacent cells can walk
		for (let i = 0; i < zone.length; i++) {
			let pos = zone[i];

			// Loop on dirs
			for (let j = 0; j < 4; j++) {
				let dir = dirs[j];

				let newPos = pos.adjacent(dir);
				if (!this.isInBoard(newPos)) continue;

				// Check if pos is walked
				if (this.isEmpty(newPos) && zone.every(p => !newPos.equal(p))) {
					return newPos;
				}
			}
        }
    }
}
