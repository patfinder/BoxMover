//import * as pathLib from 'ngraph.path';
//import createGraph from 'ngraph.graph';
//import * as $ from 'jquery';

import Cell, { isValidState, char as cChar } from './Cell';
import Board from './Board';
import Point from './Point';
import Solver from './Solver';

function pivotTable(cells: Cell[][]) {
    // Check if table is not rectangle
    const rowLength = cells[0].length;
    if (cells.some(row => row.length !== rowLength)) throw 'Not all rows have equal length.';
}

export function getBoard() {
    const O = Cell.Hole;
    const _ = Cell.Blank;
    const H = Cell.Wall;
    const X = Cell.Box;

    // NOTE: It is best to mark Cells outside game area with Wall (instead of Blank)
    const boardInput = [
            // Y   X 0  1  2  3  4  5  6  7
            /* 0 */[H, H, H, H, H, H, H, H],
            /* 1 */[H, _, _, _, _, _, _, H],
            /* 2 */[H, _, _, _, _, X, _, H],
            /* 3 */[H, _, _, _, H, _, _, H],
            /* 4 */[H, _, _, _, _, H, O, H],
            /* 5 */[H, H, H, H, H, H, H, H],
    ];

    return boardInput;
}

function pushState() {
    throw `Not implemnted`;
}

function popState() {
    throw `Not implemnted`;
}

export function play() {
    try {
        const states = getBoard();
        const XX = states[0].length;
        const YY = states.length;

        // Check cells state
        for (let y = 0; y < YY; y++) {
            for (let x = 0; x < XX; x++) {
                const pos = new Point(x, y);
                const cell = states[y][x];
                if (!isValidState(cell)) throw `Invalid cell ${pos.toString()} state: ${cChar(cell)}`
            }
        }

        // Game board
        const game = new Board(XX, YY);
        game.initBoard(states, new Point(1, 4));
        game.printBoard();

        // Solver
        const solver = new Solver();
        solver.createGraph(game);

        // Play Game
        console.log(`solver: ${solver}`);
    }
    catch (error) {
        console.log('Error', error);
    }
}
