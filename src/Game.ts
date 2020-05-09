import * as pathLib from 'ngraph.path';
import * as graphLib from 'ngraph.graph';
import * as $ from 'jquery';

/*
import Cell, { isValidState, char as cChar } from './Cell';
import Board from './Board';
import Position from './Position';
*/

try {

    /*
    const O = Cell.Hole;
    const _ = Cell.Blank;
    const H = Cell.Wall;
    const X = Cell.Box;

    const states = [
        [H, H, H, H, H, H, H, H],
        [H, _, _, _, _, _, _, H],
        [H, _, _, _, _, X, H, H],
        [H, _, _, _, _, H, _, H],
        [H, _, _, _, _, H, O, H],
        [H, H, H, H, H, H, H, H],
    ];

    const XX = states.length;
    const YY = states[0].length;

    // Check cells state
    for (let x = 0; x < XX; x++) {
        for (let y = 0; y < YY; y++) {
            const pos = new Position(x, y);
            const cell = states[x][y];
            if (!isValidState(cell)) throw `Invalid cell ${pos.toString()} state: ${cChar(cell)}`
        }
    }

    const board = new Board(XX, YY);
    board.initBoard(states, new Position(1, 1));
    board.printBoard();

    const pos = new Position(3, 7); // 3,7 false
    console.log(`Can move: ${pos.toString()} - ${board.canMove(pos)}`);
    */

    // ============================================================

    console.log('graphLib: ', graphLib);

    let createGraph;
    createGraph = graphLib;
    const graph = createGraph();

    graph.addLink('a', 'b', { weight: 10 });
    graph.addLink('a', 'c', { weight: 10 });
    graph.addLink('c', 'd', { weight: 15  });
    graph.addLink('b', 'd', { weight: 10 });

    const pathFinder = pathLib.aStar(graph, {
        // We tell our pathfinder what should it use as a distance function:
        distance(fromNode, toNode, link: any) {
            // We don't really care about from/to nodes in this case,
            // as link.data has all needed information:
            return link.data.weight;
        }
    });

    const path = pathFinder.find('a', 'd');
    console.log('Path: ', path.map(n => n.id).join(' -> '));
}
catch (error) {
    console.log('Error', error);
}


console.log('wait');
