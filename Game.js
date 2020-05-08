import Cell, { BlankFlag, HoleFlag, WallFlag, BoxFlag } from './Cell';
import Board from './Board';
import Position from './Position';

const O = HoleFlag;
const _ = BlankFlag;
const H = WallFlag;
const X = BoxFlag;

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
console.log(`Can move: ${pos.toString()} - ${board.canMove(pos)}`);
