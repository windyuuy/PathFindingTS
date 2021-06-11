import { Vec3 } from "cc";
import { GridGraph } from "../GridGenerator";
import { GridNode } from "../GridNode";

type int = number
type long = number
type float = number
type bool = boolean
type NavGraph = GridGraph
type GraphNode = GridNode
const GraphNode = GridNode
type Vector3 = Vec3
const Vector3 = Vec3

/// <summary>
/// Holds a bitmask of graphs.
/// This bitmask can hold up to 32 graphs.
///
/// The bitmask can be converted to and from integers implicitly.
///
/// <code>
/// GraphMask mask1 = GraphMask.FromGraphName("My Grid Graph");
/// GraphMask mask2 = GraphMask.FromGraphName("My Other Grid Graph");
///
/// NNConstraint nn = NNConstraint.Default;
///
/// nn.graphMask = mask1 | mask2;
///
/// // Find the node closest to somePoint which is either in 'My Grid Graph' OR in 'My Other Grid Graph'
/// var info = AstarPath.active.GetNearest(somePoint, nn);
/// </code>
///
/// See: bitmasks (view in online documentation for working links)
/// </summary>
/**
 * struct GraphMask
 */
export class GraphMask {
	public clone() {
		return new GraphMask(this.value)
	}

	/// <summary>Bitmask representing the mask</summary>
	public value!: int;

	/// <summary>A mask containing every graph</summary>
	public static get everything(): GraphMask { return new GraphMask(-1); }

	public constructor(value: int) {
		this.value = value;
	}

	public static toInt(mask: GraphMask): int {
		return mask.value;
	}

	public static toGraphMask(mask: int): GraphMask {
		return new GraphMask(mask);
	}

	/// <summary>Combines two masks to form the intersection between them</summary>
	public static and(lhs: GraphMask, rhs: GraphMask): GraphMask {
		return new GraphMask(lhs.value & rhs.value);
	}

	/// <summary>Combines two masks to form the union of them</summary>
	public static or(lhs: GraphMask, rhs: GraphMask): GraphMask {
		return new GraphMask(lhs.value | rhs.value);
	}

	/// <summary>Inverts the mask</summary>
	public static invertOp(lhs: GraphMask): GraphMask {
		return new GraphMask(~lhs.value);
	}

	/// <summary>True if this mask contains the graph with the given graph index</summary>
	public Contains(graphIndex: int): boolean {
		return ((this.value >> graphIndex) & 1) != 0;
	}

	/// <summary>A bitmask containing the given graph</summary>
	public static FromGraph(graph: GridGraph): GraphMask {
		return new GraphMask(1 << graph.graphIndex);
	}

	public ToString(): string {
		return this.value.toString();
	}

}

/**
 * class NNConstraint
 */
/// <summary>Nearest node constraint. Constrains which nodes will be returned by the <see cref="AstarPath.GetNearest"/> function</summary>
export class NNConstraint {
	/// <summary>
	/// Graphs treated as valid to search on.
	/// This is a bitmask meaning that bit 0 specifies whether or not the first graph in the graphs list should be able to be included in the search,
	/// bit 1 specifies whether or not the second graph should be included and so on.
	/// <code>
	/// // Enables the first and third graphs to be included, but not the rest
	/// myNNConstraint.graphMask = (1 << 0) | (1 << 2);
	/// </code>
	/// <code>
	/// GraphMask mask1 = GraphMask.FromGraphName("My Grid Graph");
	/// GraphMask mask2 = GraphMask.FromGraphName("My Other Grid Graph");
	///
	/// NNConstraint nn = NNConstraint.Default;
	///
	/// nn.graphMask = mask1 | mask2;
	///
	/// // Find the node closest to somePoint which is either in 'My Grid Graph' OR in 'My Other Grid Graph'
	/// var info = AstarPath.active.GetNearest(somePoint, nn);
	/// </code>
	///
	/// Note: This does only affect which nodes are returned from a <see cref="AstarPath.GetNearest"/> call, if a valid graph is connected to an invalid graph using a node link then it might be searched anyway.
	///
	/// See: <see cref="AstarPath.GetNearest"/>
	/// See: <see cref="SuitableGraph"/>
	/// See: bitmasks (view in online documentation for working links)
	/// </summary>
	public graphMask: GraphMask = new GraphMask(-1);

	/// <summary>Only treat nodes in the area <see cref="area"/> as suitable. Does not affect anything if <see cref="area"/> is less than 0 (zero)</summary>
	public constrainArea!: bool;

	/// <summary>Area ID to constrain to. Will not affect anything if less than 0 (zero) or if <see cref="constrainArea"/> is false</summary>
	public area: int = -1;

	/// <summary>Constrain the search to only walkable or unwalkable nodes depending on <see cref="walkable"/>.</summary>
	public constrainWalkability: bool = true;

	// 偏好 walkable node
	public preferWalkability: bool = true;

	/// <summary>
	/// Only search for walkable or unwalkable nodes if <see cref="constrainWalkability"/> is enabled.
	/// If true, only walkable nodes will be searched for, otherwise only unwalkable nodes will be searched for.
	/// Does not affect anything if <see cref="constrainWalkability"/> if false.
	/// </summary>
	public walkable: bool = true;

	/// <summary>
	/// if available, do an XZ check instead of checking on all axes.
	/// The navmesh/recast graph supports this.
	///
	/// This can be important on sloped surfaces. See the image below in which the closest point for each blue point is queried for:
	/// [Open online documentation to see images]
	///
	/// The navmesh/recast graphs also contain a global option for this: <see cref="Pathfinding.NavmeshBase.nearestSearchOnlyXZ"/>.
	/// </summary>
	public distanceXZ!: bool;

	/// <summary>
	/// Sets if tags should be constrained.
	/// See: <see cref="tags"/>
	/// </summary>
	public constrainTags: bool = true;

	/// <summary>
	/// Nodes which have any of these tags set are suitable.
	/// This is a bitmask, i.e bit 0 indicates that tag 0 is good, bit 3 indicates tag 3 is good etc.
	/// See: <see cref="constrainTags"/>
	/// See: <see cref="graphMask"/>
	/// See: bitmasks (view in online documentation for working links)
	/// </summary>
	public tags: int = -1;

	/// <summary>
	/// Constrain distance to node.
	/// Uses distance from <see cref="AstarPath.maxNearestNodeDistance"/>.
	/// If this is false, it will completely ignore the distance limit.
	///
	/// If there are no suitable nodes within the distance limit then the search will terminate with a null node as a result.
	/// Note: This value is not used in this class, it is used by the AstarPath.GetNearest function.
	/// </summary>
	public constrainDistance: bool = true;

	/// <summary>
	/// Returns whether or not the graph conforms to this NNConstraint's rules.
	/// Note that only the first 31 graphs are considered using this function.
	/// If the <see cref="graphMask"/> has bit 31 set (i.e the last graph possible to fit in the mask), all graphs
	/// above index 31 will also be considered suitable.
	/// </summary>
	public SuitableGraph(graphIndex: int, graph: NavGraph): bool {
		return this.graphMask.Contains(graphIndex);
	}

	/// <summary>Returns whether or not the node conforms to this NNConstraint's rules</summary>
	public Suitable(node: GraphNode): bool {
		if (this.constrainWalkability && node.Walkable != this.walkable) return false;

		if (this.constrainArea && this.area >= 0 && node.Area != this.area) return false;

		if (this.constrainTags && ((this.tags >> node.Tag) & 0x1) == 0) return false;

		return true;
	}

	/// <summary>
	/// The default NNConstraint.
	/// Equivalent to new NNConstraint ().
	/// This NNConstraint has settings which works for most, it only finds walkable nodes
	/// and it constrains distance set by A* Inspector -> Settings -> Max Nearest Node Distance
	/// </summary>
	public static get Default(): NNConstraint {
		return new NNConstraint();
	}

	public static readonly SharedDefault: NNConstraint = new NNConstraint()

	/// <summary>Returns a constraint which does not filter the results</summary>
	public static get None(): NNConstraint {
		return new NNConstraint({
			preferWalkability: true,
			constrainWalkability: false,
			constrainArea: false,
			constrainTags: false,
			constrainDistance: false,
			graphMask: new GraphMask(-1),
		});
	}

	public static readonly SharedNone: NNConstraint = new NNConstraint({
		preferWalkability: true,
		constrainWalkability: false,
		constrainArea: false,
		constrainTags: false,
		constrainDistance: false,
		graphMask: new GraphMask(-1),
	});

	public static readonly SharedWalkable: NNConstraint = new NNConstraint({
		preferWalkability: true,
		constrainWalkability: true,
		walkable: true,
		constrainArea: false,
		constrainTags: false,
		constrainDistance: false,
		graphMask: new GraphMask(-1),
	});

	/// <summary>Default constructor. Equals to the property <see cref="Default"/></summary>
	public constructor(n?: {
		preferWalkability?: bool,
		constrainWalkability?: bool,
		constrainArea?: bool,
		constrainTags?: bool,
		constrainDistance?: bool,
		graphMask?: GraphMask,
		walkable?: bool,
	}) {
		if (n != null) {
			if (n.preferWalkability != null) {
				this.preferWalkability = n.preferWalkability
			}
			if (n.constrainWalkability != null) {
				this.constrainWalkability = n.constrainWalkability
			}
			if (n.constrainArea != null) {
				this.constrainArea = n.constrainArea
			}
			if (n.constrainTags != null) {
				this.constrainTags = n.constrainTags
			}
			if (n.constrainDistance != null) {
				this.constrainDistance = n.constrainDistance
			}
			if (n.graphMask != null) {
				this.graphMask = n.graphMask
			}
			if (n.walkable != null) {
				this.walkable = n.walkable
			}
		}
	}
}

/// <summary>
/// A special NNConstraint which can use different logic for the start node and end node in a path.
/// A PathNNConstraint can be assigned to the Path.nnConstraint field, the path will first search for the start node, then it will call <see cref="SetStart"/> and proceed with searching for the end node (nodes in the case of a MultiTargetPath).\n
/// The default PathNNConstraint will constrain the end point to lie inside the same area as the start point.
/// </summary>
/**
 * class PathNNConstraint
 */
export class PathNNConstraint extends NNConstraint {
	public static get Default(): PathNNConstraint {
		return new PathNNConstraint({
			constrainArea: true
		});
	}

	/// <summary>Called after the start node has been found. This is used to get different search logic for the start and end nodes in a path</summary>
	public SetStart(node: GraphNode): void {
		if (node != null) {
			this.area = node.Area;
		} else {
			this.constrainArea = false;
		}
	}
}

/// <summary>
/// Internal result of a nearest node query.
/// See: NNInfo
/// </summary>
/**
 * struct NNInfoInternal
 */
export class NNInfoInternal {
	public clone() {
		return new NNInfoInternal(this.node)
	}

	/// <summary>
	/// Closest node found.
	/// This node is not necessarily accepted by any NNConstraint passed.
	/// See: constrainedNode
	/// </summary>
	public node!: GraphNode;

	/// <summary>
	/// Optional to be filled in.
	/// If the search will be able to find the constrained node without any extra effort it can fill it in.
	/// </summary>
	public constrainedNode?: GraphNode;

	/// <summary>The position clamped to the closest point on the <see cref="node"/>.</summary>
	public clampedPosition: Vector3 = new Vector3();

	/// <summary>Clamped position for the optional constrainedNode</summary>
	public constClampedPosition: Vector3 = new Vector3();

	public constructor(node?: GraphNode) {
		if (node != null) {
			this.node = node;
			this.constrainedNode = undefined;
			this.clampedPosition.reset();
			this.constClampedPosition.reset();

			this.UpdateInfo();
		}
	}

	/// <summary>Updates <see cref="clampedPosition"/> and <see cref="constClampedPosition"/> from node positions</summary>
	public UpdateInfo(): void {
		this.clampedPosition.set(this.node != null ? this.node.position.asVec3() : Vector3.ZERO);
		this.constClampedPosition.set(this.constrainedNode != null ? this.constrainedNode.position.asVec3() : Vector3.ZERO);
	}
}

/// <summary>Result of a nearest node query</summary>
/**
 * struct NNInfo
 */
export class NNInfo {
	public clone() {
		return new NNInfo(this)
	}
	/// <summary>Closest node</summary>
	public readonly node!: GraphNode;

	/// <summary>
	/// Closest point on the navmesh.
	/// This is the query position clamped to the closest point on the <see cref="node"/>.
	/// </summary>
	public readonly position: Vector3 = new Vector3();

	public constructor(internalInfo?: NNInfoInternal | NNInfo) {
		if (internalInfo != null) {
			if (internalInfo instanceof NNInfoInternal) {
				this.node = internalInfo.node;
				this.position = internalInfo.clampedPosition;
			} else if (internalInfo instanceof NNInfo) {
				this.node = internalInfo.node;
				this.position = internalInfo.position;
			}
		}
	}

	public static asVec3(ob: NNInfo) {
		return ob.position.tempClone();
	}

	public static asGraphNode(ob: NNInfo) {
		return ob.node;
	}
}
