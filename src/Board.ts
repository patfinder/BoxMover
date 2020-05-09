import Cell, { isValidState, char as cChar } from './Cell';
import Direction from './Direction';
import Point, { parseId } from './Position';
import * as graphLib from 'ngraph.graph';
import { Graph } from 'ngraph.graph';
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
    manPos: Point;
    graph: graphLib.Graph;
    pathFinder: PathFinder<number>;

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
	 * Initialize cell value
	 * @param {Point} pos cell position
	 * @param {Cell} cell
	 */
    initCell(pos: Point, cell: Cell) {
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
    initBoard(board: Cell[][], manPos: Point) {

        // box count
        this.boxCount = 0;

        // cells
        for (let x = 0; x < this.X; x++) {
            for (let y = 0; y < this.Y; y++) {
                this.initCell(new Point(x, y), board[x][y]);
            }
        }

        // man pos
        this.manPos = new Point(manPos.x, manPos.y);

        this.createGraph();
    }

    createGraph() {
        this.graph = (graphLib as any)();
        this.pathFinder = pathLib.aStar(this.graph);

        const graph = this.graph;

        // Create nodes
        for (let x = 0; x < this.X; x++) {
            // Y-1 cols
            for (let y = 0; y < this.Y - 1; y++) {

                const node = new Point(x, y);
                const right = node.right;
                const bottom = node.bottom;

                // This is Wall
                if (this.isWall(node)) continue;

                graph.addNode(node.id);

                // Node is Box
                if (this.isBox(node)) continue;

                // Right is empty
                if (this.isEmpty(right)) {
                    graph.addLink(node.id, right.id);
                }

                // Last row, no bottom
                if (x === this.X - 1) continue;

                // Bottom is empty
                if (this.isEmpty(bottom)) {
                    graph.addLink(node.id, bottom.id);
                }
            }
        }
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
	 * This pos is occupied (Wall or Block)
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
	 * Check if Man can move to specified position.
	 * True if there is a path between Man's pos and the position.
	 * @param {pos} pos
	 */
    canMove(pos: Point) {
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
	 * @param {[Point]} zone current cells in the zone
	 * @returns {Point} next movable position
	 */
    findMove(zone: Point[]) {
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
    getPath(pos: Point) {
        return this.pathFinder.find(this.manPos.id, pos.id);
    }

    printBoardWithPath(path: graphLib.Node[]) {
        const points = path.map(p => {
            const ids = parseId(p.id as string);
            return new Point(parseInt(ids[0]), parseInt(ids[1]));
        });

        this.printBoard(points);
    }
}
