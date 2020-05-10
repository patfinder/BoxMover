import * as graphLib from 'ngraph.graph';
import * as pathLib from 'ngraph.path';

import Cell, { isValidState, char as cChar } from './Cell';
import Direction from './Direction';
import Point, { parseId } from './Point';
import { CNodeData } from './Solver';

export default class Board {
	/**
	 * Note: x = 0: top, y = 0: left
	 */
    X: number;
    Y: number;
    cells: Cell[][];
    boxCount: number;
    manPos: Point;

	/**
	 * 
	 * @param {any} X
	 * @param {any} Y
	 * @param {Point} manPos Man's initial position
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
	 * Initialize board
	 * @param {Cell[x][y]} board of cell states
	 */
    initBoard(board: Cell[][], manPos: Point) {

        // box count
        this.boxCount = 0;

        // Init cells
        for (let x = 0; x < this.X; x++) {
            for (let y = 0; y < this.Y; y++) {
                this.cells[x][y] = board[x][y];
            }
        }

        // man pos
        this.manPos = new Point(manPos.x, manPos.y);

        //this.createGraph(); // TODO
    }

	/**
	 * Check if a pos is in board
	 * @param {any} pos
	 */
    isInBoard(pos: Point) {
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
        for (let x = 0; x < this.X; x++) {
            for (let y = 0; y < this.Y; y++) {
                const pos = new Point(x, y);
                const cell = this.cells[x][y];

                // Not a valid state
                if (!isValidState(cell)) {
                    return `Cell [${pos.toString()}] state ${cell} is invalid`;
                }

                // Box count
                if (cell & Cell.Box) boxCount++;

                // Hole count
                if (cell & Cell.Hole) holeCount++;
            }
        }

        // Box count = Hole count
        if (boxCount !== holeCount) return `Box count (${boxCount}) != Hole count (${holeCount})`;

        return '';
    }

	/**
	 * Check if a cell is empty (no Box or Wall)
	 * @param {any} pos
	 */
    isEmpty(pos: Point) {
        const { x, y } = pos;
        return (this.cells[x][y] & Cell.ObjNibbles) === 0;
    }

    isHole(pos: Point) {
        const { x, y } = pos;
        return Boolean(this.cells[x][y] & Cell.Hole);
    }

	/**
	 * This pos is occupied (by Wall or Block)
	 * @param {any} pos
	 */
    isOccupied(pos: Point) {
        return !this.isEmpty(pos);
    }

    /**
	 * This pos is Wall
	 * @param {any} pos
	 */
    isWall(pos: Point) {
        const { x, y } = pos;
        return Boolean(this.cells[x][y] & Cell.Wall);
    }

    isBox(pos: Point) {
        const { x, y } = pos;
        return Boolean(this.cells[x][y] & Cell.Box);
    }

    /**
     * 
     * @param pos
     */
    canMoveHPerma(pos: Point): boolean {
        
    }

    canMoveVPerma(pos: Point): boolean {

    }

    /**
     * Box at specified Box can only move on one Direction (H or V)
     * @param pos Position of the Box
     */
    onlyMoveOneDirection(pos): Direction {
        if (!this.isBox(pos)) throw `Current pos${pos.str} must be a Box`;

        d
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

    printBoard(points: Point[] = [], pathChar = '.') {
        console.log(`X: ${this.X}, Y: ${this.Y} - valid: ${this.validate()}`);
        console.log(`Man: ${this.manPos.x}, ${this.manPos.y}`);

        // Print columns
        const cols = [...Array(this.Y).keys()].join('');
        console.log(` ${cols}`);
        for (let x = 0; x < this.X; x++) {
            // Print rows
            let row = `${x}`;
            for (let y = 0; y < this.Y; y++) {
                const pos = new Point(x, y);

                // On path
                if (points.some(p => p.equal(pos))) {
                    row += pathChar;
                    continue;
                }

                if (pos.equal(this.manPos)) row += 'M';
                else row += cChar(this.cells[x][y]);
            }
            console.log(row);
        }
    }

	/**
	 * Find a cell adjacent to cells that can move
	 * @param {[Point]} zone current cells in the zone
	 * @returns {Point} next movable position
	 */
    findMove__(zone: Point[]) {
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
    getPath(pathFinder: pathLib.PathFinder<CNodeData>, pos: Point): graphLib.Node<CNodeData>[] {
        return pathFinder.find(this.manPos.id, pos.id);
    }

    printBoardWithPath(path: graphLib.Node[]) {
        const points = path.map(p => {
            const ids = parseId(p.id as string);
            return new Point(parseInt(ids[0]), parseInt(ids[1]));
        });

        this.printBoard(points);
    }
}
