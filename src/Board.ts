import * as graphLib from 'ngraph.graph';
import * as pathLib from 'ngraph.path';

import Cell, { isValidState, char as cChar } from './Cell';
import Direction from './Direction';
import Point, { parseId } from './Point';
import { CNodeData } from './Solver';
import { pad } from './utils';

/**
 * Note: y: row index, top to bottom
 *       x: column index, left to right
 *       -------------> X
 *       |
 *       |
 *       |
 *       |
 *       Y
 */
export default class Board {

    /*
     * Row index
     */
    X: number;
    /*
     * Row index
     */
    Y: number;
    // x first index, y second index
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

        // Y: first index (rows), X: second index (columns)
        this.cells = [];
        for (let y = 0; y < Y; y++) {
            this.cells[y] = [];
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
        for (let y = 0; y < this.Y; y++) {
            for (let x = 0; x < this.X; x++) {
                this.cells[y][x] = board[y][x];
            }
        }

        // man pos
        this.manPos = new Point(manPos.x, manPos.y);
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
        for (let y = 0; y < this.Y; y++) {
            for (let x = 0; x < this.X; x++) {
                const pos = new Point(x, y);
                const cell = this.cells[y][x];

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
        return (this.cells[y][x] & Cell.ObjNibbles) === 0;
    }

    isHole(pos: Point) {
        const { x, y } = pos;
        return Boolean(this.cells[y][x] & Cell.Hole);
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
        return Boolean(this.cells[y][x] & Cell.Wall);
    }

    isBox(pos: Point) {
        const { x, y } = pos;
        return Boolean(this.cells[y][x] & Cell.Box);
    }

    hasWallOnX(pos: Point): boolean {
        return this.isWall(pos.left) || this.isWall(pos.right);
    }

    hasWallOnY(pos: Point): boolean {
        return this.isWall(pos.top) || this.isWall(pos.bottom);
    }

    blockedOnX(me: Point): boolean {

        if (!this.isBox(me)) throw 'Not a Box';

        if (this.hasWallOnX(me)) return true;

        const left = me.left, right = me.right;

        if (this.isBox(left) && this.isWall(left.left)) return true;

        if (this.isBox(right) && this.isWall(right.right)) return true;

        return false;
    }

    blockedOnY(me: Point): boolean {

        if (!this.isBox(me)) throw 'Not a Box';

        if (this.hasWallOnY(me)) return true;

        const top = me.top, bottom = me.bottom;

        if (this.isBox(top) && this.isWall(top.top)) return true;

        if (this.isBox(bottom) && this.isWall(bottom.bottom)) return true;

        return false;
    }

    /**
     * 
     * @param me
     * @param them
     */
    needThemMoveToMove(me: Point, them: Point) {

        if (!this.isBox(me)) throw `${me.str} is not a Box`;

        if (!this.isBox(them)) throw `${them.str} is not a Box`;

        // They are on X
        if ((them.equal(me.left) || them.equal(me.right)) && this.hasWallOnY(me)) return true;

        // They are on Y
        if ((them.equal(me.top) || them.equal(me.bottom)) && this.hasWallOnX(me)) return true;

        return false;
    }

    isAtCorner(me: Point): boolean {
        if (!this.isBox(me)) throw `${me.str} is not a Box`;

        return this.hasWallOnX(me) && this.hasWallOnY(me);
    }

    /**
     * Box at specified Box can only move on one Direction (H or V)
     * @param pos Position of the Box
     */
    onlyMoveOneDirection(me: Point): Direction {
        //if(this.blo)

        // TODO
        throw `Not implemnted`;
    }

    pushState() {
        throw `Not implemnted`;
    }

    popState() {
        throw `Not implemnted`;
    }

    walkAlongAWall() {
        // TODO:
    }

    isBlockedBox(me: Point) {

        if (!this.isBox(me)) throw `${me.str} is not a Box`;

        // Is at a corner
        if (this.isAtCorner(me)) return true;

        return this.blockedOnX(me) && this.blockedOnY(me);
    }

    /*
     * This Box has reached Goal.
     */
    reachGoal(me: Point) {
        return this.isBox(me) && this.isHole(me);
    }

	/**
	 * Check if two board are equal which means Boxes are at the same place
     * And man can walk from position on this board to position on the other board
	 * @param {any} board2
	 */
    isEqual(board2: Board) {

        // In one game, this may not neccessary
        if (this.boxCount !== board2.boxCount) return false;

        // Compare all the Boxes
        for (let y = 0; y < this.Y - 1; y++) {
            for (let x = 0; x < this.X - 1; x++) {
                const pos = new Point(x, y);
                if (this.isBox(pos) && !board2.isBox(pos)) return false;
            }
        }

        // Check if man can walk
        if (this.manPos.equal(board2.manPos)) return true;

        // TODO: pathFinder
        return this.walkTo(null, board2.manPos).length !== 0;
    }

    printBoard(points: Point[] = [], pathChar = '.') {
        console.log(`X: ${this.X}, Y: ${this.Y} - valid: ${this.validate()}`);
        console.log(`Man: ${this.manPos.x}, ${this.manPos.y}`);

        // Print X axis
        const xAxis = [...Array(this.X).keys()].join('');
        console.log(`   ${xAxis}`);

        for (let y = 0; y < this.Y; y++) {
            // Y axis ranks
            let row = `${pad(y, 2)} `;

            for (let x = 0; x < this.X; x++) {
                const pos = new Point(x, y);

                // On path
                if (points.some(p => p.equal(pos))) {
                    row += pathChar;
                    continue;
                }

                // Man
                if (pos.equal(this.manPos)) row += 'M';
                else row += cChar(this.cells[y][x]);
            }
            console.log(row);
        }
    }

	/**
	 * Find Man shortest path to specified pos
	 * @param pos target pos
	 */
    walkTo(pathFinder: pathLib.PathFinder<CNodeData>, pos: Point): graphLib.Node<CNodeData>[] {
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
