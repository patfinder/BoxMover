import Cell, { isValidState, char as cChar } from './Cell';
import Direction from './Direction';
import Position, { idFromXY } from './Position';
import createGraph, { Graph } from 'ngraph.graph';
import * as pathLib from 'ngraph.path';
import { PathFinder } from 'ngraph.path';

export default class Board {
	/**
	 * Note: x = 0: top, y = 0: left
	 */
	X: number;
	Y: number;
	cells: Cell[][];
	boxCount: number;
	manPos: Position;
	graph: Graph;
	pathFinder: PathFinder<number>;

	/**
	 * 
	 * @param {any} X
	 * @param {any} Y
	 * @param {Position} manPos Man's initial position
	 */
	constructor(X: number, Y: number) {
		this.X = X;
		this.Y = Y;

		// X: first index, Y: second index
		this.cells = [];
		for (let x = 0; x < X; x++) {
			this.cells[x] = [];
		}
	}

	/**
	 * Initialize cell value
	 * @param {Position} pos cell position
	 * @param {Cell} cell
	 */
	initCell(pos: Position, cell: Cell) {
		const { x, y } = pos;
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

		this.cells[x][y] = cell;
	}

	/**
	 * Initialize board
	 * @param {Cell[x][y]} board of cell states
	 */
	initBoard(board: Board, manPos: Position) {

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

	createGraph() {
		this.graph = createGraph();
		this.pathFinder = pathLib.aStar(this.graph, {
			// We tell our pathfinder what should it use as a distance function:
			distance(_fromNode, _toNode, link) {
				// We don't really care about from/to nodes in this case,
				// as link.data has all needed information:
				return link.data.weight;
			}
		});

		const graph = this.graph;

		// Create nodes
		for (let x = 0; x < this.X; x++) {
			// Y-1 cols
			for (let y = 0; y < this.Y - 1; y++) {

				const cell = this.cells[x][y];

				// This is Wall
				if (cell & Cell.Wall) continue;

				// Node: None wall cell
				const thisId = idFromXY(x, y);
				const rightId = idFromXY(x, y + 1);
				const bottomId = idFromXY(x + 1, y);

				graph.addNode(thisId);

				// Node is Box
				if (cell & Cell.Box) continue;

				// Right is empty
				if (this.cells[x][y + 1] & Cell.ObjNibbles) {
					graph.addLink(thisId, rightId);
				}

				// Last row
				if (x === this.X - 1) continue;

				// Bottom is empty
				if (this.cells[x + 1][y] & Cell.ObjNibbles) {
					graph.addLink(thisId, bottomId);
				}
			}
		}
    }

	/**
	 * Check if a pos is in board
	 * @param {any} pos
	 */
	isInBoard(pos: Position) {
		const { x, y } = pos;
		const { X, Y } = this;
		return x >= 0 && x < X && y >= 0 && y < Y;
    }

	/**
	 * Validate board state
	 * @returns {string} error string or null
	 * */
	validate() {
		let boxCount = 0;
		let holeCount = 0;
		
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
				const pos = new Position(x, y);
				const cell = this.cells[x][y];

				// Not a valid state
				if (!isValidState(cell)) {
					return `Cell [${pos.toString()}] state ${cell} is invalid`;
				}

				// Box count
				if (cell & Cell.Box) boxCount ++;

				// Hole count
				if (cell & Cell.Hole) holeCount++;
			}
		}
		
		// Box count = Hole count
		if(boxCount !== holeCount) return `Box count (${boxCount}) != Hole count (${holeCount})`;

		return '';
    }

	/**
	 * Check if a cell is empty (no Box or Wall)
	 * @param {any} pos
	 */
	isEmpty(pos: Position) {
		const { x, y } = pos;
		return (this.cells[x][y] & Cell.ObjNibbles) === 0;
	}

	/**
	 * This pos is occupied (Wall or Block)
	 * @param {any} pos
	 */
	isOccupied(pos: Position) {
		return !this.isEmpty(pos);
    }

	/**
	 * Check if two board are equal
	 * @param {any} board2
	 */
	isEqual(/*board2*/) {
		// TODO: isEqual
		throw 'Not implemented';
		//return this.boxCount === board2.boxCount
	}

	printBoard() {
		console.log(`X: ${this.X}, Y: ${this.Y} - valid: ${this.validate()}`);
		console.log(`Man: ${this.manPos.x}, ${this.manPos.y}`);

		const cols = [...Array(this.Y).keys()].join('');
		console.log(` ${cols}`);
		for (let x = 0; x < this.X; x++) {
			let row = `${x}`;
			for (let y = 0; y < this.Y; y++) {
				if (new Position(x, y).equal(this.manPos)) row += 'M';
				else row += cChar(this.cells[x][y]);
			}
			console.log(row);
        }
    }

	/**
	 * Check if Man can move to specified position.
	 * True if there is a path between Man's pos and the position.
	 * @param {pos} pos
	 */
	canMove(pos: Position) {
		// No move
		if (this.manPos.equal(pos)) return true;

		// Find all adjacent positions
		const zone = [this.manPos];

		// brute force algorithm
		for (; ;) {
			const { pos: nextPos/*, dir*/ } = this.findMove(zone) || {};

			// Cannot find new pos
			if (nextPos === undefined) return false;

			// console.log(`Dir: ${dir.char}`);

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
	findMove(zone: Position[]) {
		const dirs = [Direction.Left, Direction.Right, Direction.Up, Direction.Down];

		// For each cell in zone, check if adjacent cells can walk
		for (let i = 0; i < zone.length; i++) {
			const pos = zone[i];

			// Loop on dirs
			for (let j = 0; j < 4; j++) {
				const dir = dirs[j];
				const newPos = pos.adjacent(dir);

				if (!this.isInBoard(newPos)) continue;

				// Check if pos is walked
				if (this.isEmpty(newPos) && zone.every(p => !newPos.equal(p))) {
					return { pos: newPos, dir };
				}
			}
        }
	}

	/**
	 * Find Man shortest path to specified pos
	 * @param pos target pos
	 */
	getPath(pos: Position) {
		const manId = `${this.manPos.x}`
		this.pathFinder.find()
	}
}
