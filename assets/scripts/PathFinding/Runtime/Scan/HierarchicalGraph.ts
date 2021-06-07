import { AstarPath } from "./AstarPath"
import { Action, bool, byte, GraphNode, int, List, Queue, Stack, uint } from "./CompatDef";

export class HierarchicalGraph {
	protected readonly Tiling: int = 16;
	protected readonly MaxChildrenPerNode: int = this.Tiling * this.Tiling;
	protected readonly MinChildrenPerNode: int = this.MaxChildrenPerNode / 2;

	protected children: List<GraphNode>[] = []
	protected connections: List<int>[] = []
	protected areas: int[] = []
	protected dirty: byte[] = []

	public version: int = 0
	public onConnectedComponentsChanged?: Action;

	protected connectionCallback?: Action<GraphNode>;

	protected temporaryQueue: Queue<GraphNode> = new Queue<GraphNode>();
	protected currentChildren: List<GraphNode> = [];
	protected currentConnections: List<int> = [];
	protected currentHierarchicalNodeIndex: int = 0;
	protected temporaryStack: Stack<int> = new Stack<int>();

	protected numDirtyNodes: int = 0;
	protected dirtyNodes: GraphNode[] = new Array(128)

	protected freeNodeIndices: Stack<int> = new Stack<int>();

	protected gizmoVersion: int = 0;

	public constructor() {
		// Cache this callback to avoid allocating a new one every time the FindHierarchicalNodeChildren method is called.
		// It is a big ugly to have to use member variables for the state information in that method, but I see no better way.
		this.connectionCallback = (neighbour: GraphNode) => {
			var hIndex = neighbour.HierarchicalNodeIndex;
			if (hIndex == 0) {
				if (this.currentChildren.length < this.MaxChildrenPerNode && neighbour.Walkable /* && (((GridNode)currentChildren[0]).XCoordinateInGrid/Tiling == ((GridNode)neighbour).XCoordinateInGrid/Tiling) && (((GridNode)currentChildren[0]).ZCoordinateInGrid/Tiling == ((GridNode)neighbour).ZCoordinateInGrid/Tiling)*/) {
					neighbour.HierarchicalNodeIndex = this.currentHierarchicalNodeIndex;
					this.temporaryQueue.push(neighbour);
					this.currentChildren.push(neighbour);
				}
			} else if (hIndex != this.currentHierarchicalNodeIndex && !this.currentConnections.contains(hIndex)) {
				// The Contains call can in theory be very slow as an hierarchical node may be adjacent to an arbitrary number of nodes.
				// However in practice due to how the nodes are constructed they will only be adjacent to a smallish (≈4-6) number of other nodes.
				// So a Contains call will be much faster than say a Set lookup.
				this.currentConnections.push(hIndex);
			}
		};

		this.Grow();
	}

	protected Grow(): void {
		var newChildren: List<GraphNode>[] = new List(Math.max(64, this.children.length * 2));
		var newConnections: List<int>[] = new List(newChildren.length);
		var newAreas = new Array<int>(newChildren.length);
		var newDirty = new Array<byte>(newChildren.length);

		this.connections.copyTo(newConnections, 0);
		this.areas.copyTo(newAreas, 0);
		this.dirty.copyTo(newDirty, 0);

		for (let i = this.children.length; i < newChildren.length; i++) {
			newChildren[i] = new List<GraphNode>(this.MaxChildrenPerNode);
			newConnections[i] = new List<int>();
			if (i > 0) this.freeNodeIndices.push(i);
		}

		this.children = newChildren;
		this.connections = newConnections;
		this.areas = newAreas;
		this.dirty = newDirty;
	}

	protected GetHierarchicalNodeIndex(): int {
		if (this.freeNodeIndices.length == 0) {
			this.Grow();
		}
		return this.freeNodeIndices.pop()!
	}

	protected OnCreatedNode(node: GraphNode): void {
		if (node.NodeIndex >= this.dirtyNodes.length) {
			var newDirty = new List<GraphNode>(Math.max(node.NodeIndex + 1, this.dirtyNodes.length * 2));
			this.dirtyNodes.copyTo(newDirty, 0);
			this.dirtyNodes = newDirty;
		}
		this.AddDirtyNode(node);
	}

	public AddDirtyNode(node: GraphNode): void {
		if (!node.IsHierarchicalNodeDirty) {
			node.IsHierarchicalNodeDirty = true;
			// While the dirtyNodes array is guaranteed to be large enough to hold all nodes in the graphs
			// the array may also end up containing many destroyed nodes. This can in rare cases cause it to go out of bounds.
			// In that case we need to go through the array and filter out any destroyed nodes while making sure to mark their
			// corresponding hierarchical nodes as being dirty.
			if (this.numDirtyNodes < this.dirtyNodes.length) {
				this.dirtyNodes[this.numDirtyNodes] = node;
				this.numDirtyNodes++;
			} else {
				var maxIndex: int = 0;
				for (var i = this.numDirtyNodes - 1; i >= 0; i--) {
					if (this.dirtyNodes[i].Destroyed) {
						this.numDirtyNodes--;
						this.dirty[this.dirtyNodes[i].HierarchicalNodeIndex] = 1;
						this.dirtyNodes[i] = this.dirtyNodes[this.numDirtyNodes];
						this.dirtyNodes[this.numDirtyNodes] = null as any;
					} else {
						maxIndex = Math.max(maxIndex, this.dirtyNodes[i].NodeIndex);
					}
				}
				if (this.numDirtyNodes >= this.dirtyNodes.length) throw new Error("Failed to compactify dirty nodes array. This should not happen. " + maxIndex + " " + this.numDirtyNodes + " " + this.dirtyNodes.length);
				this.AddDirtyNode(node);
			}
		}
	}

	public NumConnectedComponents: int = 0;

	/// <summary>Get the connected component index of a hierarchical node</summary>
	public GetConnectedComponent(hierarchicalNodeIndex: int): uint {
		return this.areas[hierarchicalNodeIndex];
	}

	protected RemoveHierarchicalNode(hierarchicalNode: int, removeAdjacentSmallNodes: bool): void {
		this.freeNodeIndices.push(hierarchicalNode);
		var conns = this.connections[hierarchicalNode];

		for (let i = 0; i < conns.length; i++) {
			var adjacentHierarchicalNode = conns[i];
			// If dirty, this node will be removed later anyway, so don't bother doing anything with it.
			if (this.dirty[adjacentHierarchicalNode] != 0) continue;

			if (removeAdjacentSmallNodes && this.children[adjacentHierarchicalNode].length < this.MinChildrenPerNode) {
				this.dirty[adjacentHierarchicalNode] = 2;
				this.RemoveHierarchicalNode(adjacentHierarchicalNode, false);
			} else {
				// Remove the connection from the other node to this node as we are removing this node.
				this.connections[adjacentHierarchicalNode].remove(hierarchicalNode);
			}
		}
		conns.clear();

		var nodeChildren = this.children[hierarchicalNode];

		for (let i = 0; i < nodeChildren.length; i++) {
			this.AddDirtyNode(nodeChildren[i]);
		}

		nodeChildren.clear();
	}

	/// <summary>Recalculate the hierarchical graph and the connected components if any nodes have been marked as dirty</summary>
	public RecalculateIfNecessary(): void {
		if (this.numDirtyNodes > 0) {
			// Profiler.BeginSample("Recalculate Connected Components");
			for (let i = 0; i < this.numDirtyNodes; i++) {
				this.dirty[this.dirtyNodes[i].HierarchicalNodeIndex] = 1;
			}

			// Remove all hierarchical nodes and then build new hierarchical nodes in their place
			// which take into account the new graph data.
			for (let i = 1; i < this.dirty.length; i++) {
				if (this.dirty[i] == 1) this.RemoveHierarchicalNode(i, true);
			}
			for (let i = 1; i < this.dirty.length; i++) this.dirty[i] = 0;

			for (let i = 0; i < this.numDirtyNodes; i++) {
				this.dirtyNodes[i].HierarchicalNodeIndex = 0;
			}

			for (let i = 0; i < this.numDirtyNodes; i++) {
				var node = this.dirtyNodes[i];
				// Be nice to the GC
				this.dirtyNodes[i] = null as any;
				node.IsHierarchicalNodeDirty = false;

				if (node.HierarchicalNodeIndex == 0 && node.Walkable && !node.Destroyed) {
					this.FindHierarchicalNodeChildren(this.GetHierarchicalNodeIndex(), node);
				}
			}

			this.numDirtyNodes = 0;
			// Recalculate the connected components of the hierarchical nodes
			this.FloodFill();
			// Profiler.EndSample();
			this.gizmoVersion++;
		}
	}

	/// <summary>
	/// Recalculate everything from scratch.
	/// This is primarily to be used for legacy code for compatibility reasons, not for any new code.
	///
	/// See: <see cref="RecalculateIfNecessary"/>
	/// </summary>
	public RecalculateAll(): void {
		AstarPath.active.GetNodes(node => this.AddDirtyNode(node));
		this.RecalculateIfNecessary();
	}

	/// <summary>Flood fills the graph of hierarchical nodes and assigns the same area ID to all hierarchical nodes that are in the same connected component</summary>
	protected FloodFill(): void {
		for (let i = 0; i < this.areas.length; i++) this.areas[i] = 0;

		let stack: Stack<int> = this.temporaryStack;
		var currentArea: int = 0;
		for (let i = 1; i < this.areas.length; i++) {
			// Already taken care of
			if (this.areas[i] != 0) continue;

			currentArea++;
			this.areas[i] = currentArea;
			stack.push(i);
			while (stack.length > 0) {
				let node: int = stack.pop()!;
				var conns = this.connections[node];
				for (let j = conns.length - 1; j >= 0; j--) {
					var otherNode = conns[j];
					// Note: slightly important that this is != currentArea and not != 0 in case there are some connected, but not stongly connected components in the graph (this will happen in only veeery few types of games)
					if (this.areas[otherNode] != currentArea) {
						this.areas[otherNode] = currentArea;
						stack.push(otherNode);
					}
				}
			}
		}

		this.NumConnectedComponents = Math.max(1, currentArea + 1);
		this.version++;
	}

	/// <summary>Run a BFS out from a start node and assign up to MaxChildrenPerNode nodes to the specified hierarchical node which are not already assigned to another hierarchical node</summary>
	protected FindHierarchicalNodeChildren(hierarchicalNode: int, startNode: GraphNode): void {
		// Set some state for the connectionCallback delegate to use
		this.currentChildren = this.children[hierarchicalNode];
		this.currentConnections = this.connections[hierarchicalNode];
		this.currentHierarchicalNodeIndex = hierarchicalNode;

		var que = this.temporaryQueue;
		que.push(startNode);

		startNode.HierarchicalNodeIndex = hierarchicalNode;
		this.currentChildren.push(startNode);

		if (this.connectionCallback != null) {
			while (que.length > 0) {
				que.pop()!.GetConnections(this.connectionCallback);
			}
		}

		for (let i = 0; i < this.currentConnections.length; i++) {
			this.connections[this.currentConnections[i]].push(hierarchicalNode);
		}

		que.clear();
	}

}
