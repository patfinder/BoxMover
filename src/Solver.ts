import * as graphLib from 'ngraph.graph';
import { Graph } from 'ngraph.graph';
import * as pathLib from 'ngraph.path';
import { PathFinder } from 'ngraph.path';

import Board from "./Board";
import Point from "./Point";

// Graph NodeData for cell
export type CNodeData = number;

export default class Solver {
    initialBoard: Board;
    graph: graphLib.Graph<CNodeData>;
    pathFinder: PathFinder<CNodeData>;

    //constructor() {
    //}

    createGraph(board: Board) {
        this.graph = (graphLib as any)();
        this.pathFinder = pathLib.aStar(this.graph, {
            //distance: (_from, _to, link) => {
            //    return link.data.weight;
            //},
        });

        const graph = this.graph;

        // Create nodes
        for (let x = 0; x < board.X; x++) {
            // Y-1 cols
            for (let y = 0; y < board.Y - 1; y++) {

                const node = new Point(x, y);
                const right = node.right;
                const bottom = node.bottom;

                // This is Wall
                if (board.isWall(node)) continue;

                graph.addNode(node.id);

                // Node is Box
                if (board.isBox(node)) continue;

                // Right is empty
                if (board.isEmpty(right)) {
                    graph.addLink(node.id, right.id);
                }

                // Last row, no bottom
                if (x === board.X - 1) continue;

                // Bottom is empty
                if (board.isEmpty(bottom)) {
                    graph.addLink(node.id, bottom.id);
                }
            }
        }
    }

    isBlockedBox(board: Board, pos: Point) {
        // Current pos must be Box
        if (!board.isBox(pos)) throw `Current pos${pos.str} must be a Box`;

        // Can only move on one direction (H or V)
    }
}
