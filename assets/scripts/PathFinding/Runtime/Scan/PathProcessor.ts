import { AstarPath } from "./AstarPath";
import { GraphNode, int, Stack } from "./CompatDef";

export class PathProcessor {

	readonly astar!: AstarPath;

	public constructor(astar: AstarPath) {
		this.astar = astar;
	}

	readonly nodeIndexPool: Stack<int> = new Stack<int>();

	/// <summary>
	/// Destroyes the given node.
	/// This is to be called after the node has been disconnected from the graph so that it cannot be reached from any other nodes.
	/// It should only be called during graph updates, that is when the pathfinding threads are either not running or paused.
	///
	/// Warning: This method should not be called by user code. It is used internally by the system.
	/// </summary>
	public DestroyNode(node: GraphNode): void {
		if (node.NodeIndex == -1) return;

		this.nodeIndexPool.push(node.NodeIndex);

		// for (let i = 0; i < this.pathHandlers.Length; i++) {
		// 	this.pathHandlers[i].DestroyNode(node);
		// }

		this.astar.hierarchicalGraph.AddDirtyNode(node);
	}

}
