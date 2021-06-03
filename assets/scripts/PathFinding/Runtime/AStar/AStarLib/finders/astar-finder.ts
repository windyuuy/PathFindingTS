// import { minBy, remove } from 'lodash';

import { backtrace } from '../core/util';
import { calculateHeuristic } from '../core/heuristic';
import { Grid } from '../core/grid';
import {
  IAStarFinderConstructorFromGraph,
  IAStarFinderConstructorFromMatrix,
  IPoint
} from '../interfaces/astar.interfaces';
import { ANode } from '../core/node';
import { Heuristic } from '../types/astar.types';

export class FindPathResult {
  paths: number[][] = []
  ok: boolean = false
}

export class AStarFinder {
  // Grid
  private grid!: Grid;

  // Lists
  private closedList!: ANode[];
  private openList!: ANode[];

  // Pathway variables
  // readonly 
  diagonalAllowed!: boolean;
  private heuristic!: Heuristic;
  // readonly
  includeStartNode!: boolean;
  // readonly
  includeEndNode!: boolean;
  private weight!: number;

  private walkThroughAnyway: boolean = true

  loadFromMatrix(aParams: IAStarFinderConstructorFromMatrix) {
    // Create grid
    this.grid = new Grid().loadFromMatrix({
      width: aParams.grid.width,
      height: aParams.grid.height,
      matrix: aParams.grid.matrix || undefined,
      densityOfObstacles: aParams.grid.densityOfObstacles || 0
    });

    // Init lists
    this.closedList = [];
    this.openList = [];

    // Set diagonal boolean
    this.diagonalAllowed =
      aParams.diagonalAllowed !== undefined ? aParams.diagonalAllowed : true;

    // Set heuristic function
    this.heuristic = aParams.heuristic ? aParams.heuristic : 'Manhattan';

    // Set if start node included
    this.includeStartNode =
      aParams.includeStartNode !== undefined ? aParams.includeStartNode : true;

    // Set if end node included
    this.includeEndNode =
      aParams.includeEndNode !== undefined ? aParams.includeEndNode : true;

    // Set weight
    this.weight = aParams.weight || 1;

    return this
  }

  loadFromGraph(aParams: IAStarFinderConstructorFromGraph) {
    // Create grid
    this.grid = new Grid().loadFromGraph({
      width: aParams.grid.width,
      height: aParams.grid.height,
      nodes: aParams.grid.nodes,
      densityOfObstacles: aParams.grid.densityOfObstacles || 0
    });

    // Init lists
    this.closedList = [];
    this.openList = [];

    // Set diagonal boolean
    this.diagonalAllowed =
      aParams.diagonalAllowed !== undefined ? aParams.diagonalAllowed : true;

    // Set heuristic function
    this.heuristic = aParams.heuristic ? aParams.heuristic : 'Manhattan';

    // Set if start node included
    this.includeStartNode =
      aParams.includeStartNode !== undefined ? aParams.includeStartNode : true;

    // Set if end node included
    this.includeEndNode =
      aParams.includeEndNode !== undefined ? aParams.includeEndNode : true;

    // Set weight
    this.weight = aParams.weight || 1;

    return this
  }

  public findPath(startPosition: IPoint, endPosition: IPoint): FindPathResult {
    var result = new FindPathResult();

    // Reset lists
    this.closedList = [];
    this.openList = [];

    // Reset grid
    this.grid.resetGrid();

    const startNode = this.grid.getNodeAt(startPosition);
    const endNode0 = this.grid.getNodeAt(endPosition);
    var endNode = endNode0
    if (!endNode.isWalkable) {
      endNode = this.grid.findClosestWalkableNode(endNode0, startNode)!
      if (endNode == null) {
        this.grid.seekDirectTo(startNode, endNode0)
        result.paths = backtrace(endNode0, this.includeStartNode, this.includeEndNode);
        result.ok = true
        return result
      } else {
        this.grid.seekDirectTo(endNode, endNode0)
      }
    }

    // Break if start and/or end position is/are not walkable
    if (!this.walkThroughAnyway) {
      if (
        !this.grid.isWalkableAt(endPosition) ||
        !this.grid.isWalkableAt(startPosition)
      ) {
        // Path could not be created because the start and/or end position is/are not walkable.
        return result;
      }
    }

    // Push start node into open list
    startNode.setIsOnOpenList(true);
    this.openList.push(startNode);

    // Loop through the grid
    // Set the FGH values of non walkable nodes to zero and push them on the closed list
    // Set the H value for walkable nodes
    for (let y = 0; y < this.grid.height; y++) {
      for (let x = 0; x < this.grid.width; x++) {
        let node = this.grid.getNodeAt({ x, y });
        if (!this.grid.isWalkableAt({ x, y })) {
          // OK, this node is not walkable
          // Set FGH values to zero
          node.setFGHValuesToZero();
          // Put on closed list
          node.setIsOnClosedList(true);
          this.closedList.push(node);
        } else {
          // OK, this node is walkable
          // Calculate the H value with the corresponding heuristic function
          node.setHValue(
            calculateHeuristic(
              this.heuristic,
              // node.ipos,
              // endNode.ipos,
              node,
              endNode,
              this,
              this.grid,
            )
          );
        }
      }
    }

    // As long the open list is not empty, continue searching a path
    while (this.openList.length !== 0) {
      // Get node with lowest f value
      const currentNode = lang.helper.ArrayHelper.min(this.openList, (o) => {
        return o.getFValue();
      })!;

      // Move current node from open list to closed list
      currentNode.setIsOnOpenList(false);
      // remove(this.openList, currentNode);
      // lang.helper.ArrayHelper.remove(this.openList, currentNode);
      this.openList.remove(currentNode)

      currentNode.setIsOnClosedList(true);
      this.closedList.push(currentNode);

      // End of path is reached
      if (currentNode === endNode) {
        result.ok = true;
        result.paths = backtrace(endNode0, this.includeStartNode, this.includeEndNode);
        return result;
      }

      // Get neighbors
      const neighbors = this.grid.getSurroundingNodes(
        currentNode.ipos,
        this.diagonalAllowed
      );

      // TODO: 处理孤岛
      if (neighbors.length == 0 && this.openList.length == 0) {
        var nearNode = this.grid.findClosestWalkableNode(currentNode, endNode)
        if (nearNode != null) {
          this.grid.seekDirectTo(currentNode, nearNode)
          this.openList.push(nearNode)
          continue
        }
      }

      // Loop through all the neighbors
      for (let i in neighbors) {
        const neightbor = neighbors[i];

        // Continue if node on closed list
        if (neightbor.getIsOnClosedList()) {
          continue;
        }

        // Calculate the g value of the neightbor
        const nextGValue =
          currentNode.getGValue() +
          (neightbor.ipos.x !== currentNode.ipos.x ||
            neightbor.ipos.y! == currentNode.ipos.y
            ? this.weight
            : this.weight * 1.41421);

        // Is the neighbor not on open list OR
        // can it be reached with lower g value from current position
        if (
          !neightbor.getIsOnOpenList() ||
          nextGValue < neightbor.getGValue()
        ) {
          neightbor.setGValue(nextGValue);
          neightbor.setParent(currentNode);

          if (!neightbor.getIsOnOpenList()) {
            neightbor.setIsOnOpenList(true);
            this.openList.push(neightbor);
          } else {
            // okay this is a better way, so change the parent
            neightbor.setParent(currentNode);
          }
        }
      }
    }
    // Path could not be created
    return result;
  }

  /**
   * Set the heuristic to be used for pathfinding.
   * @param newHeuristic
   */
  public setHeuristic(newHeuristic: Heuristic): void {
    this.heuristic = newHeuristic;
  }

  /**
   * Set the weight for the heuristic function.
   * @param newWeight
   */
  public setWeight(newWeight: number): void {
    this.weight = newWeight;
  }
  public getWeight(): number {
    return this.weight
  }

  /**
   * Get a copy/clone of the grid.
   */
  public getGridClone(): ANode[][] {
    return this.grid.clone();
  }

  /**
   * Get the current grid
   */
  public getGrid(): Grid {
    return this.grid;
  }
}
