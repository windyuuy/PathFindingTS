import { ANode } from './node';
import { IGridConstructorFromGraph, IGridConstructorFromMatrix, IPoint } from '../interfaces/astar.interfaces';

export class Grid {
  // General properties
  // readonly
  width!: number;
  // readonly
  height!: number;
  // readonly
  numberOfFields!: number;

  // The node grid
  private gridNodes!: ANode[][];

  loadFromMatrix(aParams: IGridConstructorFromMatrix) {
    // Set the general properties
    if (aParams.width && aParams.height) {
      this.width = aParams.width;
      this.height = aParams.height;
      this.numberOfFields = this.width * this.height;
    } else if (aParams.matrix) {
      this.width = aParams.matrix[0].length;
      this.height = aParams.matrix.length;
      this.numberOfFields = this.width * this.height;
    }

    // Create and generate the matrix
    this.gridNodes = this.buildGridWithNodesFromMatrix(
      aParams.matrix || undefined,
      this.width,
      this.height,
      aParams.densityOfObstacles || 0
    );

    return this;
  }

  /**
   * Build grid, fill it with nodes and return it.
   * @param matrix [ 0 or 1: 0 = walkable; 1 = not walkable ]
   * @param width [grid width]
   * @param height [grid height]
   * @param densityOfObstacles [density of non walkable fields]
   */
  private buildGridWithNodesFromMatrix(
    matrix: number[][] | undefined,
    width: number,
    height: number,
    densityOfObstacles: number
  ): ANode[][] {
    const newGrid: ANode[][] = [];
    let id: number = 0;

    // Generate an empty matrix
    for (let y = 0; y < height; y++) {
      newGrid[y] = [];
      for (let x = 0; x < width; x++) {
        newGrid[y][x] = new ANode({
          id: id,
          ipos: { x: x, y: y }
        });

        id++;
      }
    }

    /**
     * If we have not loaded a predefined matrix,
     * loop through our grid and set random obstacles.
     */
    if (matrix === undefined) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const rndNumber = Math.floor(Math.random() * 10) + 1;
          if (rndNumber > 10 - densityOfObstacles) {
            newGrid[y][x].setIsWalkable(false);
          } else {
            newGrid[y][x].setIsWalkable(true);
          }
        }
      }

      return newGrid;
    }

    /**
     * In case we have a matrix loaded.
     * Load up the informations of the matrix.
     */
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (matrix[y][x]) {
          newGrid[y][x].setIsWalkable(false);
        } else {
          newGrid[y][x].setIsWalkable(true);
        }
      }
    }

    return newGrid;
  }

  loadFromGraph(aParams: IGridConstructorFromGraph) {
    // Set the general properties
    this.width = aParams.width;
    this.height = aParams.height;
    this.numberOfFields = this.width * this.height;

    // Create and generate the matrix
    this.gridNodes = this.buildGridWithNodesFromGraph(
      aParams.nodes,
      this.width,
      this.height,
      aParams.densityOfObstacles || 0
    );

    return this;
  }

  /**
   * Build grid, fill it with nodes and return it.
   * @param nodes [ 0 or 1: 0 = walkable; 1 = not walkable ]
   * @param width [grid width]
   * @param height [grid height]
   * @param densityOfObstacles [density of non walkable fields]
   */
  private buildGridWithNodesFromGraph(
    nodes: ANode[],
    width: number,
    height: number,
    densityOfObstacles: number
  ): ANode[][] {
    const newGrid: ANode[][] = [];
    let id: number = 0;

    // Generate an empty matrix
    for (let y = 0; y < height; y++) {
      var pz = y * width;
      newGrid[y] = [];
      for (let x = 0; x < width; x++) {
        var index = pz + x
        var node = nodes[index].clone()
        newGrid[y][x] = node

        id++;
      }
    }

    /**
     * In case we have a matrix loaded.
     * Load up the informations of the matrix.
     */
    // for (let y = 0; y < height; y++) {
    //   for (let x = 0; x < width; x++) {
    //     if (nodes[y][x]) {
    //       newGrid[y][x].setIsWalkable(false);
    //     } else {
    //       newGrid[y][x].setIsWalkable(true);
    //     }
    //   }
    // }

    return newGrid;
  }

  /**
   * Return a specific node.
   * @param position [position on the grid]
   */
  public getNodeAt(position: IPoint): ANode {
    return this.gridNodes[position.y][position.x];
  }

  /**
   * Check if specific node walkable.
   * @param position [position on the grid]
   */
  public isWalkableAt(position: IPoint): boolean {
    return this.gridNodes[position.y][position.x].getIsWalkable();
  }

  /**
   * Check if specific node is on the grid.
   * @param position [position on the grid]
   */
  private isOnTheGrid(position: IPoint): boolean {
    return (
      position.x >= 0 &&
      position.x < this.width &&
      position.y >= 0 &&
      position.y < this.height
    );
  }

  /**
   * Get surrounding nodes.
   * @param currentXPos [x-position on the grid]
   * @param currentYPos [y-position on the grid]
   * @param diagnonalMovementAllowed [is diagnonal movement allowed?]
   */
  public getSurroundingNodes(
    currentPosition: IPoint,
    diagnonalMovementAllowed: boolean
  ): ANode[] {
    const surroundingNodes: ANode[] = [];

    for (var y = currentPosition.y - 1; y <= currentPosition.y + 1; y++) {
      for (var x = currentPosition.x - 1; x <= currentPosition.x + 1; x++) {
        if (this.isOnTheGrid({ x, y })) {
          // TODO: 增加通路判断
          if (this.isWalkableAt({ x, y })) {
            if (diagnonalMovementAllowed) {
              surroundingNodes.push(this.getNodeAt({ x, y }));
            } else {
              if (x == currentPosition.x || y == currentPosition.y) {
                surroundingNodes.push(this.getNodeAt({ x, y }));
              }
            }
          } else {
            continue;
          }
        } else {
          continue;
        }
      }
    }

    return surroundingNodes;
  }

  public setGrid(newGrid: ANode[][]): void {
    this.gridNodes = newGrid;
  }

  /**
   * Reset the grid
   */
  public resetGrid(): void {
    for (let y = 0; y < this.gridNodes.length; y++) {
      for (let x = 0; x < this.gridNodes[y].length; x++) {
        this.gridNodes[y][x].setIsOnClosedList(false);
        this.gridNodes[y][x].setIsOnOpenList(false);
        this.gridNodes[y][x].setParent(undefined);
        this.gridNodes[y][x].setFGHValuesToZero();
      }
    }
  }

  /**
   * Get all the nodes of the grid.
   */
  public getGridNodes(): ANode[][] {
    return this.gridNodes;
  }

  /**
   * Get a clone of the grid
   */
  public clone(): ANode[][] {
    const cloneGrid: ANode[][] = [];
    let id: number = 0;

    for (let y = 0; y < this.height; y++) {
      cloneGrid[y] = [];
      for (let x = 0; x < this.width; x++) {
        cloneGrid[y][x] = new ANode({
          id: id,
          ipos: { x: x, y: y },
          walkable: this.gridNodes[y][x].getIsWalkable()
        });

        id++;
      }
    }
    return cloneGrid;
  }
}
