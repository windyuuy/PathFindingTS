import { Vec3 } from "cc";
import { AstarPath } from "./AstarPath";
import { Connection } from "./Connection";
import { GridGraph } from "./GridGenerator";
import { Int3 } from "./Int3";

export class GridNode {
	protected static _indexAcc = 0
	public static genIndex() {
		return this._indexAcc++;
	}

	position: Int3 = new Int3()

	Penalty: number = 0
	Tag: number = 0

	Walkable: boolean = false
	WalkableErosion: boolean = false

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

	/// <summary>
	/// True if the node has a connection in the specified direction.
	/// Deprecated: Use HasConnectionInDirection
	/// </summary>
	/**
	 * @deprecated Use HasConnectionInDirection
	 */
	public GetConnectionInternal(dir: number): boolean {
		return this.HasConnectionInDirection(dir);
	}

	public ResetConnectionsInternal() {
		// unchecked
		{
			this.gridFlags = (this.gridFlags & ~this.GridFlagsConnectionMask);
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

	protected static hashCodeAcc: number = 1
	protected hashCode: number = 0;
	public GetHashCode(): number {
		if (this.hashCode <= 0) {
			this.hashCode = GridNode.hashCodeAcc++;
		}
		return this.hashCode
	}

	static get _gridGraphs() {
		return AstarPath.active.graphs;
	}
	get _gridGraphs() {
		return GridNode._gridGraphs
	}

	public static GetGridGraph(graphIndex: number): GridGraph {
		return this._gridGraphs[graphIndex];
	}
	public GetGridGraph(graphIndex: number): GridGraph {
		return GridNode.GetGridGraph(graphIndex)
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

	}

}
