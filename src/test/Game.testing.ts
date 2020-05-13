//import * as pathLib from 'ngraph.path';
//import createGraph from 'ngraph.graph';
//import * as $ from 'jquery';

import Cell, { isValidState, char as cChar } from './Cell';
import Board from './Board';
import Point from './Point';
import Solver from './Solver';
import { getBoard } from './Game';

function checkCellsState(cells: Cell[][]) {
    const XX = cells[0].length;
    const YY = cells.length;

    // Check cells state
    for (let y = 0; y < YY; y++) {
        for (let x = 0; x < XX; x++) {
            const pos = new Point(x, y);
            const cell = cells[y][x];
            if (!isValidState(cell)) throw `Invalid cell ${pos.toString()} state: ${cChar(cell)}`
        }
    }
}

try {

    const states = getBoard();

    checkCellsState(states);

    // Board
    const XX = states[0].length;
    const YY = states.length;

    const man = new Point(1, 4);
    const board = new Board(XX, YY);
    board.initBoard(states, man);

    // Solver
    const solver = new Solver();
    solver.createGraph(board);

    // Find Path
    const pos = new Point(5, 3); // 7, 3 false
    const path = board.walkTo(solver.pathFinder, pos);
    const pathStr = path.map(n => n.id).join(' <- ');
    console.log(`Path to ${pos.toString()}: ${pathStr}`);
    board.printBoardWithPath(path);

    // ============================================================

    console.log('Testing .....................');

}
catch (error) {
    console.log('Error', error);
}

console.log('wait');
