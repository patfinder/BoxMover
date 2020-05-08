import Cell from './CellState';
import Board from './Board';
import Position from './Position';

const O = Cell.Hole;
const _ = Cell.Blank;
const H = Cell.Wall;
const X = Cell.Box;

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

var board = new Board(XX, YY);
board.initBoard(states, new Position(1, 1));
board.printBoard();

var pos = new Position(2, 2);
var posStr = JSON.stringify(pos);
console.log(`Can move: ${posStr} - ${board.canMove(pos)}`);
