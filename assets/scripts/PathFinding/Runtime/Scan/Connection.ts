import { GridNode } from "./GridNode";

export class Connection {
	/// <summary>Node which this connection goes to</summary>
	public node!: GridNode;
	public cost: number = 0;

	public shapeEdge: number = 0;

	public Connection(node: GridNode, cost: number, shapeEdge: number = 0xFF) {
		this.node = node;
		this.cost = cost;
		this.shapeEdge = shapeEdge;
	}

	public GetHashCode(): number {
		return this.node.GetHashCode() ^ this.cost;
	}

	public Equals(obj: Object): boolean {
		if (obj == null) return false;
		var conn = obj as Connection;
		return conn.node == this.node && conn.cost == this.cost && conn.shapeEdge == this.shapeEdge;
	}
}

