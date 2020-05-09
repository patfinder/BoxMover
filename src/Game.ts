//import * as pathLib from 'ngraph.path';
//import createGraph from 'ngraph.graph';
//import * as $ from 'jquery';

import Cell, { isValidState, char as cChar } from './Cell';
import Board from './Board';
import Point from './Position';

try {
    const O = Cell.Hole;
    const _ = Cell.Blank;
    const H = Cell.Wall;
    const X = Cell.Box;

    const states = [
        //     Y 0  1  2  3  4  5  6  7
        // X
        /* 0 */ [H, H, H, H, H, H, H, H],
        /* 1 */ [H, _, _, _, _, _, _, H],
        /* 2 */ [H, _, _, _, _, X, _, H],
        /* 3 */ [H, _, _, _, H, _, _, H],
        /* 4 */ [H, _, _, _, _, H, O, H],
        /* 5 */ [H, H, H, H, H, H, H, H],
    ];

    const XX = states.length;
    const YY = states[0].length;

    // Check cells state
    for (let x = 0; x < XX; x++) {
        for (let y = 0; y < YY; y++) {
            const pos = new Point(x, y);
            const cell = states[x][y];
            if (!isValidState(cell)) throw `Invalid cell ${pos.toString()} state: ${cChar(cell)}`
        }
    }

    const board = new Board(XX, YY);
    board.initBoard(states, new Point(4, 1));
    board.printBoard();

    const pos = new Point(3, 5); // 3,7 false
    const path = board.getPath(pos);
    //const pathStr = path.map(n => n.id).join(' <- ');
    //console.log(`Path: ${pos.toString()} - ${pathStr}`);
    board.printBoardWithPath(path);

    // ============================================================

    console.log('Testing .....................');

}
catch (error) {
    console.log('Error', error);
}

console.log('wait');
