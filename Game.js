import CellState from './CellState';
import Board from './Board';
import Position from './Position';

const O = CellState.Hole;
const _ = CellState.Blank;
const H = CellState.Wall;
const X = CellState.Box;

var states = [
    [H, H, H, H, H, H, H, H],
    [H, _, _, _, _, _, _, H],
    [H, _, _, _, _, X, _, H],
    [H, _, _, _, _, H, _, H],
    [H, _, _, _, _, H, O, H],
    [H, H, H, H, H, H, H, H],
];

var XX = states.length;
var YY = states[0].length;

var board = new Board(XX, YY, new Position(1, 1));
board.initBoard(states);
board.print();

var pos = new Position(2, 2);
var posStr = JSON.stringify(pos);
console.log(`Can move: ${posStr} - ${board.canMove(pos)}`);
