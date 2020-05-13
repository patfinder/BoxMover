//import * as pathLib from 'ngraph.path';
//import createGraph from 'ngraph.graph';
//import * as $ from 'jquery';

import Point from '../Point';
import Solver from '../Solver';
import { getBoard } from '../Game';
import Direction from '../Direction';

export function testIsEqual() {
    const board = getBoard();
    const board2 = board.copy;
    board2.manPos = new Point(1, 2);

    // Solver
    const solver = new Solver();
    solver.createGraph(board);

    board.pathFinder = solver.pathFinder;

    board.printBoard();
    board2.printBoard();

    if (!board.isEqual(board2)) throw 'testIsEqual failed.'
    console.log('testIsEqual succeeded.');
}

export function testNotIsEqual() {
    // Solver
    const solver = new Solver();

    const board = getBoard();
    solver.createGraph(board);
    board.pathFinder = solver.pathFinder;

    const board2 = board.copy;
    board2.manPos = new Point(1, 2);
    board2.pathFinder = solver.pathFinder;

    // Push a box
    board2.pushBox(new Point(5, 2), Direction.Left);

    board.printBoard();
    board2.printBoard();

    if (board.isEqual(board2)) throw 'testNotIsEqual failed.'
    console.log('testNotIsEqual succeeded.');
}

export function testWalkTo() {
    const board = getBoard(new Point(1, 4));

    // Solver
    const solver = new Solver();
    solver.createGraph(board);

    // Find Path
    board.pathFinder = solver.pathFinder;
    const pos = new Point(5, 3); // 7, 3 false

    const path = board.walkTo(pos);
    const pathStr = path.map(n => n.id).join(' <- ');
    console.log(`Path to ${pos.toString()}: ${pathStr}`);
    board.printBoardWithPath(path);
}
