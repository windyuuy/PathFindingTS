import { Vec3 } from "cc";
import { Connection } from "./Connection";

export class GridNode {
	position: Vec3 = new Vec3()

	Penalty: number = 0
	Tag: number = 0

	Walkable: boolean = false
	WalkableErosion: boolean = false

	NodeInGridIndex: number = -1

	public ResetConnectionsInternal() {
		// unchecked
		{
			// gridFlags = (ushort)(gridFlags & ~GridFlagsConnectionMask);
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
		// unchecked { gridFlags = (ushort)((gridFlags & ~GridFlagsConnectionMask) | (connections << GridFlagsConnectionOffset)); }
		// AstarPath.active.hierarchicalGraph.AddDirtyNode(this);
	}

	public SetConnectionInternal(dir: number, value: boolean) {
		// Set bit number #dir to 1 or 0 depending on #value
		// unchecked { gridFlags = (ushort)(gridFlags & ~((ushort)1 << GridFlagsConnectionOffset << dir) | (value ? (ushort)1 : (ushort)0) << GridFlagsConnectionOffset << dir); }
		// AstarPath.active.hierarchicalGraph.AddDirtyNode(this);
	}

	public connections: Connection[] = [];
	public ClearConnections(alsoReverse: boolean) {
		this.connections.length = 0
	}

	protected static hashCodeAcc: number = 1
	protected hashCode: number = 0;
	public GetHashCode(): number {
		if (this.hashCode <= 0) {
			this.hashCode = GridNode.hashCodeAcc++;
		}
		return this.hashCode
	}

}
