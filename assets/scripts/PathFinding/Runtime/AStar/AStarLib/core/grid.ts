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

	connectionToDirectionMap: number[] = [
		7, 0, 4, 3, 8, 1, 6, 2, 5,
	]
	private connectionToDirection(pos: IPoint): number {
		var index = 4 + pos.x + pos.y * 3
		// 3+x: 2,3,4 -> 6,7,8
		// 0+x: -1,0,1 -> 3,4,5
		// -3+x: -4,-3,-2 -> 0,1,2
		var direction = this.connectionToDirectionMap[index]
		if (direction > 7) {
			console.error("invalid direction")
		}
		return direction
	}

	private hasConnectionToNode(pos1: IPoint, pos2: IPoint): boolean {
		var direction = this.connectionToDirection({ x: pos2.x - pos1.x, y: pos2.y - pos1.y })
		var node1 = this.gridNodes[pos1.y][pos1.x]
		var isConnected = node1.HasConnectionInDirection(direction)
		return isConnected
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
				if (x == currentPosition.x && y == currentPosition.y) {
					// 排除自身节点
					continue;
				}
				var target = { x, y }
				if (this.isOnTheGrid(target)) {
					// TODO: 增加通路判断
					if (this.isWalkableAt(target)) {
						// 判断是否有通路
						if (this.hasConnectionToNode(currentPosition, target)) {
							if (diagnonalMovementAllowed) {
								surroundingNodes.push(this.getNodeAt(target));
							} else {
								if (x == currentPosition.x || y == currentPosition.y) {
									surroundingNodes.push(this.getNodeAt(target));
								}
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

	// TODO: 需要结合终点改进索引顺序
	public findClosestWalkableNode(start: ANode, endNode: ANode): ANode | null {
		var minDist = null;
		var nearNode: ANode | null = null
		var nearThStart = 0

		var offset = new fsync.Vector3(endNode.ipos.x - start.ipos.x, endNode.ipos.y - start.ipos.y)
		var offsetStart = new fsync.Vector3()
		var calcTh = (start2: IPoint, end2: IPoint) => {
			offsetStart.x = end2.x - start2.x
			offsetStart.y = end2.y - start2.y
			offsetStart.normalizeSelf()
			var th = fsync.Vector.dot(offset, offsetStart)
			return th
		}

		offset.normalizeSelf()
		for (var x = 0; x < this.width; x++) {
			for (var y = 0; y < this.height; y++) {
				var node = this.getNodeAt({ x, y })
				if (node.getIsWalkable()) {
					var dist = start.idistance(node)

					var th: number | null = null
					if (minDist == null || minDist > dist || (minDist == dist && (th = calcTh(start.ipos, endNode.ipos)) >= nearThStart)) {
						minDist = dist
						nearNode = node
						nearThStart = th != null ? th : calcTh(start.ipos, endNode.ipos)
					}
				}
			}
		}
		return nearNode
	}

	public seekDirectTo(start: ANode, target: ANode) {
		var dx = target.ipos.x - start.ipos.x
		var dy = target.ipos.y - start.ipos.y
		var startx = start.ipos.x
		var starty = start.ipos.y
		var signx = Math.sign(dx)
		var signy = Math.sign(dy)
		var amovx = Math.abs(dx) - Math.abs(dy)
		var movx = 0
		var startNode = start
		if (amovx > 0) {
			// mov x
			for (var x = 1; x <= amovx; x++) {
				movx += signx
				var node = this.getNodeAt({ x: startx + x * signx, y: starty })
				node.setParent(startNode)
				startNode = node
			}
			startx += movx
		} else if (amovx < 0) {
			// mov y
			for (var y = 1; y <= amovx; y++) {
				movx += signy
				var node = this.getNodeAt({ x: startx, y: starty + y * signy })
				node.setParent(startNode)
				startNode = node
			}
			starty += movx
		}

		amovx = Math.abs(target.ipos.x - startx)
		for (var i = 1; i <= amovx; i++) {
			var node = this.getNodeAt({ x: startx + i * signx, y: starty + i * signy })
			node.setParent(startNode)
			startNode = node
		}
	}

}
