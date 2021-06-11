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
  // paths: number[][] = []
  nodes: ANode[] = []
  ok: boolean = false
}

export class AStarFinder {
  // Grid
  private grid!: Grid;

  // Lists
  private closedList: ANode[] = [];
  private openList: ANode[] = [];

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
    this.closedList.clear();
    this.openList.clear();

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
      densityOfObstacles: aParams.grid.densityOfObstacles || 0,
      refGraph: aParams.grid.refGraph,
    });

    // Init lists
    this.closedList.clear();
    this.openList.clear();

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

    this.unwalkableCloseListInit = false

    return this
  }

  private readonly Min = lang.helper.ArrayHelper.min
  protected neighbors: ANode[] = []
  protected unwalkableCloseList: ANode[] = []
  protected unwalkableCloseListInit: boolean = false
  protected resetCloseList() {
    const closedList = this.unwalkableCloseList
    if (!this.unwalkableCloseListInit) {
      this.unwalkableCloseListInit = true
      const grid = this.grid
      const gridNodes = grid.getNodes()
      const width = grid.width
      for (let y = 0; y < grid.height; y++) {
        let sl = gridNodes[y]
        for (let x = 0; x < width; x++) {
          // let node = grid.getNodeAtXY(x, y);
          let node = sl[x]
          if (!node.isWalkable) {
            // OK, this node is not walkable
            // Set FGH values to zero
            node.setFGHValuesToZero();
            // Put on closed list
            node.setIsOnClosedList(true);
            closedList.push(node);
          }
        }
      }
    }
    this.closedList.length = 0
    this.closedList.length = closedList.length
    closedList.copyTo(this.closedList, 0)
  }

  public findPath(result: FindPathResult, startPosition: IPoint, endPosition: IPoint): FindPathResult {
    // var result = new FindPathResult();

    // Reset lists
    const closedList = this.closedList
    const openList = this.openList
    const grid = this.grid

    closedList.clear();
    openList.clear();

    // Reset grid
    grid.resetGrid();

    const startNode = grid.getNodeAt(startPosition);
    const endNode0 = grid.getNodeAt(endPosition);
    var endNode = endNode0
    if (!endNode.isWalkable) {
      endNode = grid.findClosestWalkableNode(endNode0, startNode)!
      if (endNode == null) {
        grid.seekDirectTo(startNode, endNode0)
        backtrace(result, endNode0, this.includeStartNode, this.includeEndNode);
        result.ok = true
        return result
      } else {
        grid.seekDirectTo(endNode, endNode0)
      }
    }

    // Break if start and/or end position is/are not walkable
    if (!this.walkThroughAnyway) {
      if (
        // !grid.isWalkableAt(endPosition) ||
        // !grid.isWalkableAt(startPosition)
        !endNode.isWalkable ||
        !startNode.isWalkable
      ) {
        // Path could not be created because the start and/or end position is/are not walkable.
        return result;
      }
    }

    // Push start node into open list
    startNode.setIsOnOpenList(true);
    openList.push(startNode);

    // Loop through the grid
    // Set the FGH values of non walkable nodes to zero and push them on the closed list
    // Set the H value for walkable nodes
    const heuristic = this.heuristic
    const weight = this.getWeight()
    // const weightDiagonal = weight * 1.41421
    // const gridNodes = grid.getNodes()
    // const width = grid.width
    // for (let y = 0; y < grid.height; y++) {
    //   let sl = gridNodes[y]
    //   for (let x = 0; x < width; x++) {
    //     // let node = grid.getNodeAtXY(x, y);
    //     let node = sl[x]
    //     if (!node.isWalkable) {
    //       // OK, this node is not walkable
    //       // Set FGH values to zero
    //       node.setFGHValuesToZero();
    //       // Put on closed list
    //       node.setIsOnClosedList(true);
    //       closedList.push(node);
    //     } else {
    //       // OK, this node is walkable
    //       // Calculate the H value with the corresponding heuristic function
    //       node.setHValue(
    //         calculateHeuristic(
    //           heuristic,
    //           // node.ipos,
    //           // endNode.ipos,
    //           node,
    //           endNode,
    //           weight,
    //         )
    //       );
    //     }
    //   }
    // }
    const udpateNodeHeuristic = (node: ANode) => {
      node.setHValue(
        calculateHeuristic(
          heuristic,
          node,
          endNode,
          weight,
        )
      );
    }
    this.resetCloseList()

    const neighbors = this.neighbors
    const diagonalAllowed = this.diagonalAllowed
    const Min = this.Min
    // As long the open list is not empty, continue searching a path
    while (openList.length !== 0) {
      // Get node with lowest f value
      const currentNode = Min(openList, (o) => {
        return o.getFValue();
      })!;

      // Move current node from open list to closed list
      currentNode.setIsOnOpenList(false);
      // remove(openList, currentNode);
      // lang.helper.ArrayHelper.remove(openList, currentNode);
      openList.remove(currentNode)

      currentNode.setIsOnClosedList(true);
      closedList.push(currentNode);

      // End of path is reached
      if (currentNode === endNode) {
        result.ok = true;
        backtrace(result, endNode0, this.includeStartNode, this.includeEndNode);
        return result;
      }

      // Get neighbors
      // const neighbors: ANode[] = []
      neighbors.clear()
      grid.getOpenableSurroundingNodes(
        neighbors,
        currentNode,
        diagonalAllowed
      );

      // TODO: 处理孤岛
      if (neighbors.length == 0 && openList.length == 0) {
        var nearNode = grid.findClosestWalkableNode(currentNode, endNode)
        if (nearNode != null) {
          grid.seekDirectTo(currentNode, nearNode)
          openList.push(nearNode)
          continue
        }
      }

      // Loop through all the neighbors
      for (let i in neighbors) {
        const neightbor = neighbors[i];

        const isNeighborOpened = neightbor.getIsOnOpenList()
        if (!isNeighborOpened) {
          udpateNodeHeuristic(neightbor)
        }

        // Continue if node on closed list
        // if (neightbor.getIsOnClosedList()) {
        //   continue;
        // }

        // Calculate the g value of the neightbor
        // const nextGValue =
        //   currentNode.getGValue() +
        //   ((neightbor.ipos.x == currentNode.ipos.x ||
        //     neightbor.ipos.y == currentNode.ipos.y)
        //     ? weight
        //     : weight * 1.41421);
        const nextGValue = currentNode.getGValue() + (
          currentNode.position.distance(neightbor.position)
        )

        // Is the neighbor not on open list OR
        // can it be reached with lower g value from current position
        // if (
        //   !isNeighborOpened ||
        //   nextGValue < neightbor.getGValue()
        // ) {

        if (!isNeighborOpened) {
          neightbor.setGValue(nextGValue);
          neightbor.setIsOnOpenList(true);
          // set started parent
          neightbor.setParent(currentNode);
          openList.push(neightbor);
        }
        else if (nextGValue < neightbor.getGValue()) {
          // okay this is a better way, so change the parent
          neightbor.setGValue(nextGValue);
          neightbor.setParent(currentNode);
        }
        // }
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
