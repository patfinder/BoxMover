import Cell, { BlankFlag, HoleFlag, WallFlag, BoxFlag } from './Cell';
import Board from './Board';
import Position from './Position';

const O = new Cell(HoleFlag);
const _ = new Cell(BlankFlag);
const H = new Cell(WallFlag);
const X = new Cell(BoxFlag);

var states = [
    [H, H, H, H, H, H, H, H],
    [H, _, _, _, _, _, _, H],
    [H, _, _, _, _, X, H, H],
    [H, _, _, _, _, H, _, H],
    [H, _, _, _, _, H, O, H],
    [H, H, H, H, H, H, H, H],
];

var XX = states.length;
var YY = states[0].length;

// Check cells state
for (let x = 0; x < XX; x++) {
    for (let y = 0; y < YY; y++) {
        let pos = new Position(x, y);
        let cell = states[x][y];
        if (!cell.isValidState) throw `Invalid cell ${pos.toString()} state: ${cell.char}`
    }
}

var board = new Board(XX, YY);
board.initBoard(states, new Position(1, 1));
board.printBoard();

var pos = new Position(3, 4);
console.log(`Can move: ${pos.toString()} - ${board.canMove(pos)}`);
