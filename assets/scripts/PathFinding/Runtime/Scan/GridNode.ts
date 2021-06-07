import { Vec3 } from "cc";
import { ANode } from "../AStar/AStarLib/core/node";
import { Float } from "../Basic/Float";
import { AstarPath } from "./AstarPath";
import { Connection } from "./Connection";
import { GridGraph } from "./GridGenerator";
import { Int3 } from "./Int3";

type GraphNode = GridNode
type Vector3 = Vec3
const Vector3 = Vec3
type int = number
type float = number
type bool = boolean
type uint = number

export class GridNode extends ANode {
	constructor(id: number, x: number, y: number) {
		super({
			id: id,
			ipos: { x, y },
		})

		this.nodeIndex = GridNode.genIndex()
	}


	/// <summary>
	/// X coordinate of the node in the grid.
	/// The node in the bottom left corner has (x,z) = (0,0) and the one in the opposite
	/// corner has (x,z) = (width-1, depth-1)
	/// See: ZCoordInGrid
	/// See: NodeInGridIndex
	/// </summary>
	get XCoordinateInGrid(): number {
		return this.ipos.x
	}
	/// <summary>
	/// Z coordinate of the node in the grid.
	/// The node in the bottom left corner has (x,z) = (0,0) and the one in the opposite
	/// corner has (x,z) = (width-1, depth-1)
	/// See: XCoordInGrid
	/// See: NodeInGridIndex
	/// </summary>
	get ZCoordinateInGrid(): number {
		return this.ipos.y
	}

	protected static _indexAcc = 0
	protected static genIndex() {
		return this._indexAcc++;
	}

	public Destroy(): void {
		if (this.Destroyed) return;

		this.ClearConnections(true);

		if (AstarPath.active != null) {
			AstarPath.active.DestroyNode(this);
		}
		this.NodeIndex = this.DestroyedNodeIndex;
	}

	public get Destroyed(): bool {
		return this.NodeIndex == this.DestroyedNodeIndex;
	}

	position: Int3 = new Int3()

	protected penalty: uint = 0
	/// <summary>
	/// Penalty cost for walking on this node.
	/// This can be used to make it harder/slower to walk over certain nodes.
	/// A cost of 1000 (<see cref="Pathfinding.Int3.Precision"/>) corresponds to the cost of moving 1 world unit.
	///
	/// See: graph-updates (view in online documentation for working links)
	/// </summary>
	public get Penalty(): uint {
		return this.penalty;
	}
	public set Penalty(value: uint) {
		if (value > 0xFFFFFF) {
			console.warn("Very high penalty applied. Are you sure negative values haven't underflowed?\n" +
				"Penalty values this high could with long paths cause overflows and in some cases infinity loops because of that.\n" +
				"Penalty value applied: " + value);
		}
		this.penalty = value;
	}

	Tag: number = 0
	Area!: number

	// Walkable: boolean = false

	protected flags: uint = 0;

	// If anyone creates more than about 200 million nodes then things will not go so well, however at that point one will certainly have more pressing problems, such as having run out of RAM
	readonly NodeIndexMask: int = 0xFFFFFFF;
	readonly DestroyedNodeIndex: int = this.NodeIndexMask - 1;
	readonly TemporaryFlag1Mask: int = 0x10000000;
	readonly TemporaryFlag2Mask: int = 0x20000000;

	private nodeIndex: int = 0;
	public get NodeIndex(): int {
		return this.nodeIndex & this.NodeIndexMask;
	}
	public set NodeIndex(value: int) {
		this.nodeIndex = (this.nodeIndex & ~this.NodeIndexMask) | value;
	}

	// #region Constants
	/// <summary>Position of the walkable bit. See: <see cref="Walkable"/></summary>
	/**const */
	public readonly FlagsWalkableOffset: int = 0;
	/// <summary>Mask of the walkable bit. See: <see cref="Walkable"/></summary>
	/**const */
	public readonly FlagsWalkableMask: uint = 1 << this.FlagsWalkableOffset;

	/// <summary>Start of hierarchical node index bits. See: <see cref="HierarchicalNodeIndex"/></summary>
	/**const */
	public readonly FlagsHierarchicalIndexOffset: int = 1;
	/// <summary>Mask of hierarchical node index bits. See: <see cref="HierarchicalNodeIndex"/></summary>
	/**const */
	public readonly HierarchicalIndexMask: uint = (131072 - 1) << this.FlagsHierarchicalIndexOffset;

	/// <summary>Start of <see cref="IsHierarchicalNodeDirty"/> bits. See: <see cref="IsHierarchicalNodeDirty"/></summary>
	/**const */
	public readonly HierarchicalDirtyOffset: int = 18;

	/// <summary>Mask of the <see cref="IsHierarchicalNodeDirty"/> bit. See: <see cref="IsHierarchicalNodeDirty"/></summary>
	/**const */
	public readonly HierarchicalDirtyMask: uint = 1 << this.HierarchicalDirtyOffset;

	/// <summary>Start of graph index bits. See: <see cref="GraphIndex"/></summary>
	/**const */
	public readonly FlagsGraphOffset: int = 24;
	/// <summary>Mask of graph index bits. See: <see cref="GraphIndex"/></summary>
	/**const */
	public readonly FlagsGraphMask: uint = (256 - 1) << this.FlagsGraphOffset;

	/**const */
	public readonly MaxHierarchicalNodeIndex: uint = this.HierarchicalIndexMask >> this.FlagsHierarchicalIndexOffset;

	/// <summary>Max number of graphs-1</summary>
	/**const */
	public readonly MaxGraphIndex: uint = this.FlagsGraphMask >> this.FlagsGraphOffset;

	/// <summary>Start of tag bits. See: <see cref="Tag"/></summary>
	/**const */
	public readonly FlagsTagOffset: int = 19;
	/// <summary>Mask of tag bits. See: <see cref="Tag"/></summary>
	/**const */
	public readonly FlagsTagMask: uint = (32 - 1) << this.FlagsTagOffset;

	// #endregion

	/// <summary>
	/// Holds various bitpacked variables.
	///
	/// Bit 0: <see cref="Walkable"/>
	/// Bits 1 through 17: <see cref="HierarchicalNodeIndex"/>
	/// Bit 18: <see cref="IsHierarchicalNodeDirty"/>
	/// Bits 19 through 23: <see cref="Tag"/>
	/// Bits 24 through 31: <see cref="GraphIndex"/>
	///
	/// Warning: You should pretty much never modify this property directly. Use the other properties instead.
	/// </summary>
	public get Flags(): uint {
		return this.flags;
	}
	public set Flags(value: uint) {
		this.flags = value;
	}

	/// <summary>
	/// True if the node is traversable.
	///
	/// See: graph-updates (view in online documentation for working links)
	/// </summary>
	public get Walkable(): bool {
		return (this.flags & this.FlagsWalkableMask) != 0;
	}
	public set Walkable(value: bool) {
		this.flags = this.flags & ~this.FlagsWalkableMask | (value ? 1 : 0) << this.FlagsWalkableOffset;
		// AstarPath.active.hierarchicalGraph.AddDirtyNode(this);
	}

	/// <summary>
	/// Stores walkability before erosion is applied.
	/// Used internally when updating the graph.
	/// </summary>
	public get WalkableErosion(): bool {
		return (this.gridFlags & this.GridFlagsWalkableErosionMask) != 0;
	}
	public set WalkableErosion(value: bool) {
		// unchecked
		{
			this.gridFlags = (this.gridFlags & ~this.GridFlagsWalkableErosionMask | (value ? this.GridFlagsWalkableErosionMask : 0));
		}
	}

	/// <summary>
	/// Hierarchical Node that contains this node.
	/// The graph is divided into clusters of small hierarchical nodes in which there is a path from every node to every other node.
	/// This structure is used to speed up connected component calculations which is used to quickly determine if a node is reachable from another node.
	///
	/// See: <see cref="Pathfinding.HierarchicalGraph"/>
	///
	/// Warning: This is an internal property and you should most likely not change it.
	/// </summary>
	get HierarchicalNodeIndex(): int {
		return ((this.flags & this.HierarchicalIndexMask) >> this.FlagsHierarchicalIndexOffset);
	}
	set HierarchicalNodeIndex(value: int) {
		this.flags = (this.flags & ~this.HierarchicalIndexMask) | (value << this.FlagsHierarchicalIndexOffset);
	}

	/// <summary>Some internal bookkeeping</summary>
	public get IsHierarchicalNodeDirty(): bool {
		return (this.flags & this.HierarchicalDirtyMask) != 0;
	}
	public set IsHierarchicalNodeDirty(value: bool) {
		this.flags = this.flags & ~this.HierarchicalDirtyMask | (value ? 1 : 0) << this.HierarchicalDirtyOffset;
	}

	protected static hashCodeAcc: number = 1
	protected hashCode: number = 0;
	public GetHashCode(): number {
		if (this.hashCode <= 0) {
			this.hashCode = GridNode.hashCodeAcc++;
		}
		return this.hashCode
	}

	protected static get _gridGraphs() {
		return AstarPath.active.graphs;
	}
	protected get _gridGraphs() {
		return GridNode._gridGraphs
	}

	public static GetGridGraph(graphIndex: number): GridGraph {
		return this._gridGraphs[graphIndex];
	}
	public GetGridGraph(graphIndex: number): GridGraph {
		return GridNode.GetGridGraph(graphIndex)
	}

	protected readonly GridFlagsWalkableErosionOffset: int = 8;
	protected readonly GridFlagsWalkableErosionMask: int = 1 << this.GridFlagsWalkableErosionOffset;

	protected readonly GridFlagsWalkableTmpOffset: int = 9;
	protected readonly GridFlagsWalkableTmpMask: int = 1 << this.GridFlagsWalkableTmpOffset;

	protected readonly NodeInGridIndexLayerOffset: int = 24;

	protected static NodeInGridIndexMask = 0xFFFFFF;
	protected get NodeInGridIndexMask() {
		return GridNode.NodeInGridIndexMask
	}

	public GraphIndex: number = 0

	nodeInGridIndex: number = -1
	public get NodeInGridIndex() {
		return this.nodeInGridIndex & this.NodeInGridIndexMask;
	}
	public set NodeInGridIndex(value: number) {
		this.nodeInGridIndex = (this.nodeInGridIndex & ~this.NodeInGridIndexMask) | value;
	}


	static GridFlagsConnectionOffset: number = 0;
	static GridFlagsConnectionBit0: number = 1 << GridNode.GridFlagsConnectionOffset;
	static GridFlagsConnectionMask: number = 0xFF << GridNode.GridFlagsConnectionOffset;
	static GridFlagsEdgeNodeOffset: number = 10;
	static GridFlagsEdgeNodeMask: number = 1 << GridNode.GridFlagsEdgeNodeOffset;
	get GridFlagsConnectionOffset() { return GridNode.GridFlagsConnectionOffset }
	get GridFlagsConnectionBit0() { return GridNode.GridFlagsConnectionBit0 }
	get GridFlagsConnectionMask() { return GridNode.GridFlagsConnectionMask }
	get GridFlagsEdgeNodeOffset() { return GridNode.GridFlagsEdgeNodeOffset }
	get GridFlagsEdgeNodeMask() { return GridNode.GridFlagsEdgeNodeMask }


	protected gridFlags: number = 0

	public get InternalGridFlags() {
		return this.gridFlags
	}
	public set InternalGridFlags(value: number) {
		this.gridFlags = value
	}

	public get HasConnectionsToAllEightNeighbours(): boolean {
		return (this.InternalGridFlags & this.GridFlagsConnectionMask) == this.GridFlagsConnectionMask;
	}

	/// <summary>
	/// True if the node has a connection in the specified direction.
	/// The dir parameter corresponds to directions in the grid as:
	/// <code>
	///         Z
	///         |
	///         |
	///
	///      6  2  5
	///       \ | /
	/// --  3 - X - 1  ----- X
	///       / | \
	///      7  0  4
	///
	///         |
	///         |
	/// </code>
	///
	/// See: SetConnectionInternal
	/// </summary>
	public HasConnectionInDirection(dir: number): boolean {
		return (this.gridFlags >> dir & this.GridFlagsConnectionBit0) != 0;
	}

	// /// <summary>
	// /// True if the node has a connection in the specified direction.
	// /// Deprecated: Use HasConnectionInDirection
	// /// </summary>
	// /**
	//  * @deprecated Use HasConnectionInDirection
	//  */
	// public GetConnectionInternal(dir: number): boolean {
	// 	return this.HasConnectionInDirection(dir);
	// }

	public SetConnectionInternal(dir: number, value: boolean) {
		// Set bit number #dir to 1 or 0 depending on #value
		// unchecked 
		{
			this.gridFlags = (
				this.gridFlags & ~(1 << this.GridFlagsConnectionOffset << dir)
				| (value ? 1 : 0) << this.GridFlagsConnectionOffset << dir
			);
		}
		// AstarPath.active.hierarchicalGraph.AddDirtyNode(this);
	}

	/// <summary>
	/// Sets the state of all grid connections.
	///
	/// See: SetConnectionInternal
	/// </summary>
	/// <param name="connections">a bitmask of the connections (bit 0 is the first connection, bit 1 the second connection, etc.).</param>
	public SetAllConnectionInternal(connections: number) {
		// unchecked 
		{
			this.gridFlags = ((this.gridFlags & ~this.GridFlagsConnectionMask)
				| (connections << this.GridFlagsConnectionOffset));
		}
		// AstarPath.active.hierarchicalGraph.AddDirtyNode(this);
	}

	public ResetConnectionsInternal() {
		// unchecked
		{
			this.gridFlags = (this.gridFlags & ~this.GridFlagsConnectionMask);
		}
		// AstarPath.active.hierarchicalGraph.AddDirtyNode(this);
	}

	/// <summary>
	/// Work in progress for a feature that required info about which nodes were at the border of the graph.
	/// Note: This property is not functional at the moment.
	/// </summary>
	public get EdgeNode(): boolean {
		return (this.gridFlags & this.GridFlagsEdgeNodeMask) != 0;
	}
	public set EdgeNode(value: boolean) {
		// unchecked 
		{
			this.gridFlags = (this.gridFlags & ~this.GridFlagsEdgeNodeMask | (value ? this.GridFlagsEdgeNodeMask : 0));
		}
	}

	public GetNeighbourAlongDirection(direction: number): GridNode | null {
		if (this.HasConnectionInDirection(direction)) {
			var gg: GridGraph = this.GetGridGraph(this.GraphIndex);
			return gg.nodes[this.NodeInGridIndex + gg.neighbourOffsets[direction]];
		}
		return null;
	}

	public ClearConnections(alsoReverse: boolean) {
		if (alsoReverse) {
			// Note: This assumes that all connections are bidirectional
			// which should hold for all grid graphs unless some custom code has been added
			for (var i = 0; i < 8; i++) {
				var other = this.GetNeighbourAlongDirection(i) as GridNode;
				if (other != null) {
					// Remove reverse connection. See doc for GridGraph.neighbourOffsets to see which indices are used for what.
					other.SetConnectionInternal(i < 4 ? ((i + 2) % 4) : (((i - 2) % 4) + 4), false);
				}
			}
		}

		this.ResetConnectionsInternal();

		// #if!ASTAR_GRID_NO_CUSTOM_CONNECTIONS
		// 		base.ClearConnections(alsoReverse);
		// #endif
	}

	public GetConnections(action: (graphNode: GraphNode) => void) {
		var gg: GridGraph = this.GetGridGraph(this.GraphIndex);

		var neighbourOffsets: number[] = gg.neighbourOffsets;
		var nodes: GridNode[] = gg.nodes;

		for (var i = 0; i < 8; i++) {
			if (this.HasConnectionInDirection(i)) {
				var other: GridNode = nodes[this.NodeInGridIndex + neighbourOffsets[i]];
				if (other != null) action(other);
			}
		}

		// #if!ASTAR_GRID_NO_CUSTOM_CONNECTIONS
		// 	base.GetConnections(action);
		// #endif
	}

	public ClosestPointOnNode(p: Vector3): Vector3 {
		var gg = this.GetGridGraph(this.GraphIndex);

		// Convert to graph space
		p = gg.transform.InverseTransform(p);

		// Calculate graph position of this node
		var x: int = this.NodeInGridIndex % gg.width;
		var z: int = this.NodeInGridIndex / gg.width;

		// Handle the y coordinate separately
		var y: float = gg.transform.InverseTransform(this.position.asVec3()).y;

		var closestInGraphSpace = new Vector3(Float.Clamp(p.x, x, x + 1), y, Float.Clamp(p.z, z, z + 1));

		// Convert to world space
		return gg.transform.Transform(closestInGraphSpace);
	}

	get id() {
		return this.NodeInGridIndex
	}

	public get isWalkable(): boolean {
		return this.Walkable;
	}
	public set isWalkable(value: boolean) {
		this.Walkable = value;
	}

	clone(): GridNode {
		var node = new GridNode(this.id, this.ipos.x, this.ipos.y)
		this.mergeTo(node)
		return node
	}

	mergeTo(node: GridNode) {
		super.mergeTo(node)
		node.position = this.position.clone()
		node.GraphIndex = this.GraphIndex
		node.nodeInGridIndex = this.nodeInGridIndex
		node.gridFlags = this.gridFlags


		node.Penalty = this.Penalty
		node.Tag = this.Tag

		node.Walkable = this.Walkable
		node.WalkableErosion = this.WalkableErosion
		node.hashCode = this.hashCode

		return node
	}

}
