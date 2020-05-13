import './src/test/Game.testing';
import { testIsEqual, testWalkTo, testNotIsEqual } from './src/test/Board.testing';

try {
    console.log('testIsEqual ..............................');
    testIsEqual();

    console.log('testNotIsEqual ..............................');
    testNotIsEqual();

    console.log('testWalkTo ..............................');
    testWalkTo();
}
catch (error) {
    console.log('Error', error);
}

console.log('Done.........');
