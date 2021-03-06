import { instantiate, Mat4, PhysicsRayResult, Quat, resources, Vec2, Vec3 } from "cc";
import { Heuristic, InspectorGridMode, NumNeighbours, PathFinderOptions } from "../../Editor/PathFinderOptions";
import { GraphCollision } from "./Base";
import { Float } from "../Basic/Float";
import { GraphTransform } from "./GraphTransform";
import { GridNode } from "./GridNode";
import { Int3 } from "./Int3";
import { AstarPath } from "./AstarPath";
import { ANode } from "../AStar/AStarLib/core/node";
import { Vector, Vector3 } from "../Basic/Vector";
import * as cc from "cc"
import { PathFinderDebugDrawOptions } from "../../Editor/PathFinderDebugDrawOptions";
import { MyNodePool } from "../Basic/NodePool/MyNodePool";
import { NNConstraint, NNInfoInternal } from "./NNInfo/astarclasses";
import { Action, float, GraphNode } from "./CompatDef";
import { mat4Pool, quatPool, vec3Pool, withMat4, withVec3 } from "../Basic/ObjectPool";

var sharedQuat = new Quat();
var sharedMat4 = new Mat4()
var sharedVec = new Vec3()

export class GridGraph {
	// Diagonals normally cost sqrt(2) (approx 1.41) times more
	constructor() {
		this._index = GridGraph._indexAcc++
		AstarPath.active.graphs.push(this);
	}

	protected static _indexAcc = 0
	protected _index = -1
	protected get index(): number {
		return this._index
	}
	public get graphIndex(): number {
		return this.index
	}

	public nodes: GridNode[] = [];

	public width: number = 0;

	/// <summary>Depth (height) of the grid in nodes. See: SetDimensions</summary>
	public depth: number = 0;

	public aspectRatio: number = 1;

	public transform: GraphTransform = new GraphTransform(Mat4.identity(new Mat4()));

	public collision: GraphCollision = new GraphCollision();

	public initialPenalty: number = 0;

	public penaltyPosition: boolean = false;
	public penaltyPositionOffset: number = 0;
	public penaltyPositionFactor: number = 1;

	public maxClimb: number = 0
	public maxSlope: number = 90;
	public penaltyAngle: boolean = false
	public penaltyAnglePower: number = 1;
	public penaltyAngleFactor: number = 100;

	public cutCorners: boolean = true;
	public uniformEdgeCosts: boolean = false;

	public neighbours: NumNeighbours = NumNeighbours.Eight
	public readonly LayerCount: number = 1;
	public inspectorGridMode: InspectorGridMode = InspectorGridMode.Grid;

	public asyncInterval: number = 0

	public debugDrawOptions: PathFinderDebugDrawOptions = new PathFinderDebugDrawOptions()

	static readonly standardIsometric: number = 90 - Math.atan(1 / Math.sqrt(2)) * Float.Rad2Deg;
	get standardIsometric(): number {
		return GridGraph.standardIsometric
	}

	protected get useRaycastNormal(): boolean {
		return Math.abs(90 - this.maxSlope) > Float.Epsilon;
	}

	public center: Vec3 = Vec3.ZERO.alloc()

	unclampedSize: Vec2 = new Vec2(10, 10)
	nodeSize: number = 1
	size: Vec2 = new Vec2(0, 0);
	isometricAngle: number = 0
	rotation!: Vec3

	heuristic: Heuristic = Heuristic.Euclidean
	heuristicScale: number = 1

	/// <summary>
	/// Maximum distance to search for nodes.
	/// When searching for the nearest node to a point, this is the limit (in world units) for how far away it is allowed to be.
	///
	/// This is relevant if you try to request a path to a point that cannot be reached and it thus has to search for
	/// the closest node to that point which can be reached (which might be far away). If it cannot find a node within this distance
	/// then the path will fail.
	///
	/// [Open online documentation to see images]
	///
	/// See: Pathfinding.NNConstraint.constrainDistance
	/// </summary>
	public maxNearestNodeDistance: number = 100;

	/// <summary>
	/// Max Nearest Node Distance Squared.
	/// See: <see cref="maxNearestNodeDistance"/>
	/// </summary>
	public get maxNearestNodeDistanceSqr(): number {
		return this.maxNearestNodeDistance * this.maxNearestNodeDistance;
	}

	public toIndex(x: number, y: number): number {
		x = Float.Clamp(x, 0, this.width - 1)
		y = Float.Clamp(y, 0, this.depth - 1)
		return this.width * y + x
	}

	public get up(): Vec3 {
		return this.collision.up
	}

	public Init(options: PathFinderOptions) {
		this.width = options.width
		this.depth = options.height
		this.nodeSize = options.nodeSize

		this.center = options.center
		this.rotation = options.rotation
		this.neighbours = options.neighbours
		this.maxClimb = options.maxClimb
		this.maxSlope = options.maxSlope

		this.penaltyAngle = options.penaltyAngle;
		this.penaltyAngleFactor = options.penaltyAngleFactor
		this.penaltyAnglePower = options.penaltyAnglePower
		this.penaltyPosition = options.penaltyPosition
		this.penaltyPositionFactor = options.penaltyPositionFactor
		this.penaltyPositionOffset = options.penaltyPositionOffset
		this.initialPenalty = options.initialPenalty
		this.heuristic = options.heuristic
		this.heuristicScale = options.heuristicScale

		this.cutCorners = options.cutCorners

		this.asyncInterval = options.asyncInterval
		this.maxNearestNodeDistance = options.maxNearestNodeDistance

		this.debugDrawOptions = options.debugDrawOptions

		this.SetDimensions(this.width, this.depth, this.nodeSize)

		this.collision.Initialize(options, this.transform, this.nodeSize)

		this.inspectorGridMode = options.inspectorGridMode
		var newMode = this.inspectorGridMode
		switch (newMode) {
			case InspectorGridMode.Grid:
				this.isometricAngle = 0;
				this.aspectRatio = 1;
				this.uniformEdgeCosts = false;
				if (this.neighbours == NumNeighbours.Six) this.neighbours = NumNeighbours.Eight;
				break;
			case InspectorGridMode.Hexagonal:
				this.isometricAngle = this.standardIsometric;
				this.aspectRatio = 1;
				this.uniformEdgeCosts = true;
				this.neighbours = NumNeighbours.Six;
				break;
			case InspectorGridMode.IsometricGrid:
				this.uniformEdgeCosts = false;
				if (this.neighbours == NumNeighbours.Six) this.neighbours = NumNeighbours.Eight;
				this.isometricAngle = this.standardIsometric;
				break;
			case InspectorGridMode.Advanced:
			default:
				break;
		}

		// for (var i = 0; i < this.width * this.depth; i++) {
		for (var j = 0; j < this.depth; j++) {
			for (var i = 0; i < this.width; i++) {
				var index = j * this.width + i;
				var gridNode = new GridNode(index, i, j)
				// gridNode.NodeInGridIndex = GridNode.genIndex()
				gridNode.GraphIndex = this.graphIndex;
				gridNode.NodeInGridIndex = index;
				this.nodes.push(gridNode);
			}
		}

		this.SetUpOffsetsAndCosts()
	}

	public SetUpOffsetsAndCosts() {
		//First 4 are for the four directly adjacent nodes the last 4 are for the diagonals
		var width = this.width
		var nodeSize = this.nodeSize
		var neighbourOffsets = this.neighbourOffsets
		var neighbourCosts = this.neighbourCosts
		var neighbourXOffsets = this.neighbourXOffsets
		var neighbourZOffsets = this.neighbourZOffsets

		neighbourOffsets[0] = -width;
		neighbourOffsets[1] = 1;
		neighbourOffsets[2] = width;
		neighbourOffsets[3] = -1;
		neighbourOffsets[4] = -width + 1;
		neighbourOffsets[5] = width + 1;
		neighbourOffsets[6] = width - 1;
		neighbourOffsets[7] = -width - 1;

		var straightCost = Math.round(nodeSize * Int3.Precision);

		// Diagonals normally cost sqrt(2) (approx 1.41) times more
		var diagonalCost = this.uniformEdgeCosts ? straightCost : Math.round(nodeSize * Math.sqrt(2) * Int3.Precision);

		neighbourCosts[0] = straightCost;
		neighbourCosts[1] = straightCost;
		neighbourCosts[2] = straightCost;
		neighbourCosts[3] = straightCost;
		neighbourCosts[4] = diagonalCost;
		neighbourCosts[5] = diagonalCost;
		neighbourCosts[6] = diagonalCost;
		neighbourCosts[7] = diagonalCost;

		/*         Z
		 *         |
		 *         |
		 *
		 *      6  2  5
		 *       \ | /
		 * --  3 - X - 1  ----- X
		 *       / | \
		 *      7  0  4
		 *
		 *         |
		 *         |
		 */

		neighbourXOffsets[0] = 0;
		neighbourXOffsets[1] = 1;
		neighbourXOffsets[2] = 0;
		neighbourXOffsets[3] = -1;
		neighbourXOffsets[4] = 1;
		neighbourXOffsets[5] = 1;
		neighbourXOffsets[6] = -1;
		neighbourXOffsets[7] = -1;

		neighbourZOffsets[0] = -1;
		neighbourZOffsets[1] = 0;
		neighbourZOffsets[2] = 1;
		neighbourZOffsets[3] = 0;
		neighbourZOffsets[4] = -1;
		neighbourZOffsets[5] = 1;
		neighbourZOffsets[6] = 1;
		neighbourZOffsets[7] = -1;
	}

	/// <summary>
	/// Transform a point in graph space to world space.
	/// This will give you the node position for the node at the given x and z coordinate
	/// if it is at the specified height above the base of the graph.
	/// </summary>
	public GraphPointToWorld(x: number, z: number, height: number): Int3 {
		return withVec3((out, pos) => Int3.fromVec3(this.transform.Transform(out, pos.set(x + 0.5, height, z + 0.5))))
	}

	public WorldPointToGraph(gpos: Vec3, position: Vec3): Vec3 {
		var gpos = this.transform.InverseTransform(gpos, position)
		gpos.x -= 0.5
		gpos.z -= 0.5
		// gpos.x = Math.floor(gpos.x)
		// gpos.z = Math.floor(gpos.z)
		gpos.x = Math.round(gpos.x)
		gpos.z = Math.round(gpos.z)
		return gpos
	}

	public RecalculateCell(x: number, z: number, resetPenalties: boolean = true, resetTags: boolean = true) {
		var node = this.nodes[z * this.width + x];

		// Set the node's initial position with a y-offset of zero
		var worldPos = this.GraphPointToWorld(x, z, 0)
		node.position.set(worldPos);
		worldPos.recycle()

		var out: {
			hitInfo: PhysicsRayResult,
			walkable: boolean,
		} = {
			hitInfo: new PhysicsRayResult(),
			walkable: true,
		}

		// Calculate the actual position using physics raycasting (if enabled)
		// walkable will be set to false if no ground was found (unless that setting has been disabled)
		var nodePos = node.position.asVec3()
		var position: Vec3 = this.collision.CheckHeight(nodePos, out);
		node.position.setVec3(position)

		if (resetPenalties) {
			node.Penalty = this.initialPenalty;

			// Calculate a penalty based on the y coordinate of the node
			if (this.penaltyPosition) {
				node.Penalty += Math.round((node.position.y - this.penaltyPositionOffset) * this.penaltyPositionFactor);
			}
		}

		if (resetTags) {
			node.Tag = 0;
		}

		// Check if the node is on a slope steeper than permitted
		if (out.walkable && this.useRaycastNormal && this.collision.heightCheck) {
			if (out.hitInfo.hitNormal.equals(Vec3.ZERO)) {
				// Take the dot product to find out the cosinus of the angle it has (faster than Vector3.Angle)
				let angle = withVec3(hitNormal => {
					hitNormal.set(out.hitInfo.hitNormal).normalize()
					let angle: number = Vec3.dot(hitNormal, this.collision.up);
					return angle
				})

				// Add penalty based on normal
				if (this.penaltyAngle && resetPenalties) {
					node.Penalty += Math.round((1 - Math.pow(angle, this.penaltyAnglePower)) * this.penaltyAngleFactor);
				}

				// Cosinus of the max slope
				var cosAngle: number = Math.cos(this.maxSlope * Float.Deg2Rad);

				// Check if the ground is flat enough to stand on
				if (angle < cosAngle) {
					out.walkable = false;
				}
			}
		}

		// If the walkable flag has already been set to false, there is no point in checking for it again
		// Check for obstacles
		node.Walkable = out.walkable && this.collision.Check(position);

		// Store walkability before erosion is applied. Used for graph updates
		node.WalkableErosion = node.Walkable;

		// console.log(`walkable: ${node.ipos.x},${node.ipos.y}->${node.Walkable}`)

		nodePos.recycle()
	}

	public readonly neighbourXOffsets: number[] = [0, 0, 0, 0, 0, 0, 0, 0,]
	public readonly neighbourYOffsets: number[] = [0, 0, 0, 0, 0, 0, 0, 0,]
	public readonly neighbourZOffsets: number[] = [0, 0, 0, 0, 0, 0, 0, 0,]
	public readonly neighbourOffsets: number[] = [0, 0, 0, 0, 0, 0, 0, 0,]
	public readonly neighbourCosts: number[] = [0, 0, 0, 0, 0, 0, 0, 0,]
	public static readonly hexagonNeighbourIndices: number[] = [0, 1, 5, 2, 3, 7];
	public get hexagonNeighbourIndices() {
		return GridGraph.hexagonNeighbourIndices;
	}

	public IsValidConnection(node1: GridNode, node2: GridNode): boolean {
		if (!node1.Walkable || !node2.Walkable) {
			return false;
		}

		if (this.maxClimb <= 0 || this.collision.use2D) return true;

		if (this.transform.onlyTranslational) {
			// Common case optimization.
			// If the transformation is only translational, that is if the graph is not rotated or transformed
			// in any other way than changing its center. Then we can use this simplified code.
			// This code is hot when scanning so it does have an impact.
			return Math.abs(node1.position.y - node2.position.y) <= this.maxClimb * Int3.Precision;
		} else {
			var p1 = node1.position.asVec3();
			var p2 = node2.position.asVec3();
			var up = this.transform.WorldUpAtGraphPosition(p1);
			var ret = Math.abs(Vec3.dot(up, p1) - Vec3.dot(up, p2)) <= this.maxClimb;
			p1.recycle()
			p2.recycle()
			up.recycle()
			return ret
		}
	}

	public CalculateConnections(x: number, z: number) {
		var node = this.nodes[z * this.width + x];

		// All connections are disabled if the node is not walkable
		if (!node.Walkable) {
			// Reset all connections
			// This makes the node have NO connections to any neighbour nodes
			node.ResetConnectionsInternal();
			return;
		}

		// Internal index of where in the graph the node is
		var index: number = node.NodeInGridIndex;

		if (this.neighbours == NumNeighbours.Four || this.neighbours == NumNeighbours.Eight) {
			// Bitpacked connections
			// bit 0 is set if connection 0 is enabled
			// bit 1 is set if connection 1 is enabled etc.
			var conns: number = 0;

			// Loop through axis aligned neighbours (down, right, up, left) or (-Z, +X, +Z, -X)
			for (var i = 0; i < 4; i++) {
				var nx = x + this.neighbourXOffsets[i];
				var nz = z + this.neighbourZOffsets[i];

				// Check if the new position is inside the grid
				// Bitwise AND (&) is measurably faster than &&
				// (not much, but this code is hot)
				if (nx >= 0 && nz >= 0 && nx < this.width && nz < this.depth) {
					var other = this.nodes[index + this.neighbourOffsets[i]];

					if (this.IsValidConnection(node, other)) {
						// Enable connection i
						conns |= 1 << i;
					}
				}
			}

			// Bitpacked diagonal connections
			var diagConns = 0;

			// Add in the diagonal connections
			if (this.neighbours == NumNeighbours.Eight) {
				if (this.cutCorners) {
					for (var i = 0; i < 4; i++) {
						// If at least one axis aligned connection
						// is adjacent to this diagonal, then we can add a connection.
						// Bitshifting is a lot faster than calling node.HasConnectionInDirection.
						// We need to check if connection i and i+1 are enabled
						// but i+1 may overflow 4 and in that case need to be wrapped around
						// (so 3+1 = 4 goes to 0). We do that by checking both connection i+1
						// and i+1-4 at the same time. Either i+1 or i+1-4 will be in the range
						// from 0 to 4 (exclusive)
						if (((conns >> i | conns >> (i + 1) | conns >> (i + 1 - 4)) & 1) != 0) {
							var directionIndex = i + 4;

							var nx = x + this.neighbourXOffsets[directionIndex];
							var nz = z + this.neighbourZOffsets[directionIndex];

							if (nx >= 0 && nz >= 0 && nx < this.width && nz < this.depth) {
								var other: GridNode = this.nodes[index + this.neighbourOffsets[directionIndex]];

								if (this.IsValidConnection(node, other)) {
									diagConns |= 1 << directionIndex;
								}
							}
						}
					}
				} else {
					for (var i = 0; i < 4; i++) {
						// If exactly 2 axis aligned connections is adjacent to this connection
						// then we can add the connection
						// We don't need to check if it is out of bounds because if both of
						// the other neighbours are inside the bounds this one must be too
						if ((conns >> i & 1) != 0 && ((conns >> (i + 1) | conns >> (i + 1 - 4)) & 1) != 0) {
							var other: GridNode = this.nodes[index + this.neighbourOffsets[i + 4]];

							if (this.IsValidConnection(node, other)) {
								diagConns |= 1 << (i + 4);
							}
						}
					}
				}
			}

			// Set all connections at the same time
			node.SetAllConnectionInternal(conns | diagConns);
		} else {
			// Hexagon layout

			// Reset all connections
			// This makes the node have NO connections to any neighbour nodes
			node.ResetConnectionsInternal();

			// Loop through all possible neighbours and try to connect to them
			for (var j = 0; j < this.hexagonNeighbourIndices.length; j++) {
				var i = this.hexagonNeighbourIndices[j];

				var nx = x + this.neighbourXOffsets[i];
				var nz = z + this.neighbourZOffsets[i];

				if (nx >= 0 && nz >= 0 && nx < this.width && nz < this.depth) {
					var other = this.nodes[index + this.neighbourOffsets[i]];
					node.SetConnectionInternal(i, this.IsValidConnection(node, other));
				}
			}
		}
	}

	/// <summary>
	/// Calculates the grid connections for a cell as well as its neighbours.
	/// This is a useful utility function if you want to modify the walkability of a single node in the graph.
	///
	/// <code>
	/// AstarPath.active.AddWorkItem(ctx => {
	///     var grid = AstarPath.active.data.gridGraph;
	///     int x = 5;
	///     int z = 7;
	///
	///     // Mark a single node as unwalkable
	///     grid.GetNode(x, z).Walkable = false;
	///
	///     // Recalculate the connections for that node as well as its neighbours
	///     grid.CalculateConnectionsForCellAndNeighbours(x, z);
	/// });
	/// </code>
	/// </summary>
	CalculateConnectionsForCellAndNeighbours(x: number, z: number) {
		this.CalculateConnections(x, z);
		for (let i = 0; i < 8; i++) {
			let nx: number = x + this.neighbourXOffsets[i];
			let nz: number = z + this.neighbourZOffsets[i];

			// Check if the new position is inside the grid
			// Bitwise AND (&) is measurably faster than &&
			// (not much, but this code is hot)
			if (nx >= 0 && nz >= 0 && nx < this.width && nz < this.depth) {
				this.CalculateConnections(nx, nz);
			}
		}
	}

	public SetDimensions(width: number, depth: number, nodeSize: number) {
		this.unclampedSize = new Vec2(width, depth).multiplyScalar(nodeSize);
		this.nodeSize = nodeSize;
		this.UpdateTransform();
	}

	CalculateDimensions(out: { width: number, depth: number, nodeSize: number }) {
		var newSize = this.unclampedSize;

		// Make sure size is positive
		newSize.x *= Math.sign(newSize.x);
		newSize.y *= Math.sign(newSize.y);

		// Clamp the nodeSize so that the graph is never larger than 1024*1024
		out.nodeSize = Math.max(this.nodeSize, newSize.x / 1024);
		out.nodeSize = Math.max(this.nodeSize, newSize.y / 1024);

		// Prevent the graph to become smaller than a single node
		newSize.x = newSize.x < out.nodeSize ? out.nodeSize : newSize.x;
		newSize.y = newSize.y < out.nodeSize ? out.nodeSize : newSize.y;

		this.size = newSize;

		// Calculate the number of nodes along each side
		out.width = Math.floor(this.size.x / out.nodeSize);
		out.depth = Math.floor(this.size.y / out.nodeSize);

		// Take care of numerical edge cases
		if (Float.approximately(this.size.x / out.nodeSize, Math.ceil(this.size.x / out.nodeSize))) {
			out.width = Math.ceil(this.size.x / out.nodeSize);
		}

		if (Float.approximately(this.size.y / out.nodeSize, Math.ceil(this.size.y / out.nodeSize))) {
			out.depth = Math.ceil(this.size.y / out.nodeSize);
		}
	}

	public UpdateTransform() {
		this.CalculateDimensions(this);
		this.transform = this.CalculateTransform();
	}

	/// <summary>
	/// Returns a new transform which transforms graph space to world space.
	/// Does not update the <see cref="transform"/> field.
	/// See: <see cref="UpdateTransform"/>
	/// </summary>
	public CalculateTransform(): GraphTransform {
		var out: {
			width: number,
			depth: number,
			nodeSize: number,
		} = {
			width: 0,
			depth: 0,
			nodeSize: 0,
		}
		this.CalculateDimensions(out);

		// Generate a matrix which shrinks the graph along one of the diagonals
		// corresponding to the isometricAngle

		return withVec3((cv1, cv2, cv3, cv4) => withMat4((isometricMatrix, boundsMatrix, m) => {
			Mat4.fromRTS(isometricMatrix, Quat.fromEuler(sharedQuat, 0, 45, 0), Vec3.ZERO, Vec3.ONE);
			Mat4.identity(sharedMat4);
			Mat4.scale(sharedMat4, sharedMat4, cv1.set(Math.cos(Float.Deg2Rad * this.isometricAngle), 1, 1));
			Mat4.multiply(isometricMatrix, sharedMat4, isometricMatrix);

			Mat4.multiply(isometricMatrix, Mat4.fromRTS(sharedMat4, Quat.fromEuler(sharedQuat, 0, -45, 0), Vec3.ZERO, Vec3.ONE), isometricMatrix);

			// Generate a matrix for the bounds of the graph
			// This moves a point to the correct offset in the world and the correct rotation and the aspect ratio and isometric angle is taken into account
			// The unit is still world units however
			Mat4.fromRTS(boundsMatrix, Quat.fromEuler(sharedQuat, this.rotation.x, this.rotation.y, this.rotation.z), this.center, cv2.set(this.aspectRatio, 1, 1));
			Mat4.multiply(isometricMatrix, boundsMatrix, isometricMatrix);

			// Generate a matrix where Vector3.zero is the corner of the graph instead of the center
			// The unit is nodes here (so (0.5,0,0.5) is the position of the first node and (1.5,0,0.5) is the position of the second node)
			// 0.5 is added since this is the node center, not its corner. In graph space a node has a size of 1
			sharedVec = cv3.set(out.width * out.nodeSize, 0, out.depth * out.nodeSize)
			sharedVec.negative().multiplyScalar(0.5)
			Mat4.fromRTS(sharedMat4, Quat.fromEuler(sharedQuat, this.rotation.x, this.rotation.y, this.rotation.z), sharedVec.transformMat4(boundsMatrix), cv4.set(out.nodeSize * this.aspectRatio, 1, out.nodeSize))
			Mat4.multiply(m, sharedMat4, isometricMatrix);

			// Set the matrix of the graph
			// This will also set inverseMatrix
			return new GraphTransform(m);
		}))
	}

	// TODO: ????????????????????????????????????
	public findClosestSuitableNode(nearList: GridNode[], position: Vec3, end?: Vec3, constraint?: NNConstraint, calcTh?: (start: Vec3, end2: Vec3) => number): GridNode | null {

		return withVec3((offset, offsetStart) => {
			constraint = constraint ?? NNConstraint.SharedNone
			if (calcTh == null) {
				if (end != null) {
					offset.set(end).subtract(position).normalize()
					// offsetStart = offsetStart
					calcTh = (start: Vec3, end2: Vec3) => {
						offsetStart.x = end2.x - start.x
						offsetStart.y = end2.y - start.y
						offsetStart.z = end2.z - start.z
						offsetStart.normalize()
						var th = offset.dot(offsetStart)
						return th
					}
				} else {
					calcTh = (start: Vec3, end2: Vec3) => {
						return -10
					}
				}
			}

			var minDistSq: number = Float.PositiveInfinity
			var nearNode: GridNode | null = null
			var nearTh = -10
			if ((!constraint.constrainWalkability) && constraint.preferWalkability) {
				for (var node of nearList) {
					if (constraint == NNConstraint.SharedNone || constraint.Suitable(node)) {
						var targetPos = node.position.asVec3()
						var dist = Vector.distanceSQ(targetPos, position)
						var th: number | null = null

						var isThBigger = nearTh < (th = calcTh(position, targetPos))
						var isThBigger0 = nearTh <= th
						var needThBigger = isThBigger
						if (minDistSq - dist > this.nodeSize * 2) {
							needThBigger = false;
						}
						if (needThBigger || (
							(isThBigger0) &&
							(dist < minDistSq || (node.Walkable && !nearNode!.Walkable) || (node.Walkable == nearNode!.Walkable && dist == minDistSq && isThBigger))
						)) {
							nearNode = node
							minDistSq = dist
							nearTh = th != null ? th : calcTh(position, targetPos)
						}
					}
				}
			} else {
				// console.log("batch")
				for (var node of nearList) {
					// ?????????????????????
					if (constraint == NNConstraint.SharedNone || constraint.Suitable(node)) {
						var targetPos = node.position.asVec3()
						var dist = Vector.distanceSQ(targetPos, position)
						var th: number | null = null

						// TODO: ??????????????????
						var isThBigger = nearTh < (th = calcTh(position, targetPos))
						var isThBigger0 = nearTh <= th
						var needThBigger = isThBigger
						if (minDistSq - dist > this.nodeSize * 2) {
							needThBigger = false;
						}
						// console.log("fff", position, end, targetPos, th)
						if (needThBigger ||
							((isThBigger0)
								&& (dist < minDistSq || (dist == minDistSq && isThBigger)))
						) {
							nearNode = node
							minDistSq = dist
							nearTh = th != null ? th : calcTh(position, targetPos)
						}
					}
				}
			}

			return nearNode

		})
	}

	public GetNearestNode(position: Vec3, end?: Vec3, constraint?: NNConstraint): GridNode | null {
		return withVec3((gpos) => {
			this.WorldPointToGraph(gpos, position)
			return this.GetNearestNodeByIPos(gpos, position, end, constraint)
		})
	}
	public GetNearestNodeByIPos(gpos: Vec3, position: Vec3, end?: Vec3, constraint?: NNConstraint): GridNode | null {
		return withVec3((offset, offsetStart) => {
			constraint = constraint ?? NNConstraint.SharedNone

			var index = this.toIndex(gpos.x, gpos.z)

			var nodes: GridNode[] = this.nodes;

			var nearList: GridNode[] = []
			const addIndexA = (x: number, y: number) => {
				var index = this.toIndex(x, y)
				nearList.push(nodes[index])
			}

			let calcTh = (start: Vec3, end2: Vec3) => {
				return -10
			}
			if (end != null) {
				offset.set(end).subtract(position).normalize()
				// offsetStart = offsetStart
				calcTh = (start: Vec3, end2: Vec3) => {
					offsetStart.x = end2.x - start.x
					offsetStart.y = end2.y - start.y
					offsetStart.z = end2.z - start.z
					offsetStart.normalize()
					var th = offset.dot(offsetStart)
					return th
				}
			}

			var node = nodes[index]
			if (node != null) {
				nearList.push(node)
			}

			let nearNode: GridNode | null = null
			{
				let width = this.width
				let depth = this.depth
				let gposx = gpos.x
				let gposz = gpos.z
				gposx = Float.Clamp(gposx, 0, width)
				gposz = Float.Clamp(gposz, 0, depth)
				let addIndex = addIndexA

				var fx = Math.max(gposx, width - gposx)
				var fy = Math.max(gposz, depth - gposz)
				var fm = Math.max(fx, fy)

				let index2 = this.toIndex(gposx, gposz)
				if (index2 != index) {
					let node2 = nodes[index2]
					if (node2 != null) {
						nearList.push(node2)
					}
				}

				for (let ia = 1; ia <= fm; ia++) {
					var xl = gposx - ia
					var xh = gposx + ia
					var zl = gposz - ia
					var zh = gposz + ia

					let xlMin = Math.max(xl, 0)
					let xhMin = Math.min(xh, width - 1)
					let zlMin = Math.max(zl, 0)
					let zhMin = Math.min(zh, depth - 1)

					if (zl == zlMin) {
						for (let ix = xlMin; ix <= xhMin; ix++) {
							addIndex(ix, zl)
						}
					}
					if (zh == zhMin) {
						for (let ix = xlMin; ix <= xhMin; ix++) {
							addIndex(ix, zh)
						}
					}
					if (xl == xlMin) {
						for (let iz = zlMin + 1; iz <= zhMin - 1; iz++) {
							addIndex(xl, iz)
						}
					}
					if (xh == xhMin) {
						for (let iz = zlMin + 1; iz <= zhMin - 1; iz++) {
							addIndex(xh, iz)
						}
					}
					nearNode = this.findClosestSuitableNode(nearList, position, end, constraint, calcTh);
					if (nearNode != null) {
						return nearNode
					}

					nearList.clear()
				}

			}

			return nearNode
		})
	}

	public GetNodes(action: Action<GraphNode>) {
		for (var node of this.nodes) {
			action(node)
		}
	}

	/// <summary>Returns the nearest node to a position using the specified NNConstraint.</summary>
	/// <param name="position">The position to try to find a close node to</param>
	/// <param name="hint">Can be passed to enable some graph generators to find the nearest node faster.</param>
	/// <param name="constraint">Can for example tell the function to try to return a walkable node. If you do not get a good node back, consider calling GetNearestForce.</param>
	public GetNearest(position: Vector3, constraint?: NNConstraint, hint?: GraphNode): NNInfoInternal {
		// position = position.tempClone()
		// This is a default implementation and it is pretty slow
		// Graphs usually override this to provide faster and more specialised implementations

		var maxDistSqr: number = constraint == null || constraint.constrainDistance ? this.maxNearestNodeDistanceSqr : Float.PositiveInfinity;

		var minDist: number = Float.PositiveInfinity;
		var minNode!: GraphNode

		var minConstDist: number = Float.PositiveInfinity;
		var minConstNode!: GraphNode

		// Loop through all nodes and find the closest suitable node
		this.GetNodes((node) => {
			var nodePos = node.position.asVec3()
			var dist: float = withVec3(cv1 => (cv1.set(position).subtract(nodePos)).lengthSqr())
			nodePos.recycle()

			if (dist < minDist) {
				minDist = dist;
				minNode = node;
			}

			if (dist < minConstDist && dist < maxDistSqr && (constraint == null || constraint.Suitable(node))) {
				minConstDist = dist;
				minConstNode = node;
			}
		});

		var nnInfo = new NNInfoInternal(minNode);

		nnInfo.constrainedNode = minConstNode;

		if (minConstNode != null) {
			nnInfo.constClampedPosition.set(minConstNode.position.asVec3())
		} else if (minNode != null) {
			nnInfo.constrainedNode = minNode;
			nnInfo.constClampedPosition.set(minNode.position.asVec3())
		}

		return nnInfo;
	}

	/// <summary>
	/// Returns the nearest node to a position using the specified \link Pathfinding.NNConstraint constraint \endlink.
	/// Returns: an NNInfo. This method will only return an empty NNInfo if there are no nodes which comply with the specified constraint.
	/// </summary>
	public GetNearestForce(position: Vector3, constraint: NNConstraint): NNInfoInternal {
		return this.GetNearest(position, constraint);
	}


	//#region debugDraw
	get graphicRoot() {
		return AstarPath.active.graphicRoot
	}

	protected graphNodes: cc.Node[] = []

	drawNode(gridNode: GridNode, up: Vec3, options: PathFinderDebugDrawOptions) {
		if (!options.showUnwalkableNodes) {
			if (!gridNode.Walkable) {
				return
			}
		}

		var drawBatchId = this.drawBatchId

		var pos = gridNode.position.asVec3()
		var nodePos = pos.alloc()
		var upOffsetN = options.upOffset
		if (upOffsetN != 0) {
			withVec3(upOffset => {
				upOffset.set(up)
				upOffset.multiplyScalar(upOffsetN)
				nodePos.add(upOffset)
			})
		}
		const drawNodeSize = options.drawNodeSize

		MyNodePool.load("GridHint", (node) => {
			nodePos.autorecycle()

			if (drawBatchId != this.drawBatchId) {
				MyNodePool.put(node)
				return
			}

			node.name = "GridNode"
			this.graphNodes.push(node)

			node.position = nodePos
			node.parent = this.graphicRoot
			node.setScale(drawNodeSize, drawNodeSize, drawNodeSize)

			node.getChildByName("CubeGreen")!.active = gridNode.Walkable
			node.getChildByName("CubeRed")!.active = !gridNode.Walkable
		})
	}

	drawBatchId: number = 0
	/**
	 * ????????????????????????
	 */
	public drawDebug() {
		if (!this.debugDrawOptions.enableGraphicDrawer) {
			return
		}
		if (!this.debugDrawOptions.needDrawGridMap) {
			return
		}

		this.drawBatchId++
		var drawBatchId = this.drawBatchId

		setTimeout(() => {
			MyNodePool.loadPrefab("GridHint", () => {
				if (drawBatchId != this.drawBatchId) {
					return
				}

				// ????????????????????????
				var up = this.up
				var options = this.debugDrawOptions
				for (var node of this.nodes) {
					this.drawNode(node, up, options)
				}
			})
		}, 1)
	}

	public clearDebug() {
		this.drawBatchId++
		for (let node of this.graphNodes) {
			MyNodePool.put(node)
		}
		this.graphNodes.clear()
	}
	//#endregion

}
