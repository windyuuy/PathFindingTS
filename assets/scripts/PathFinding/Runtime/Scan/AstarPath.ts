import { Graphics, Node, Vec3 } from "cc";
import { PathFinderOptions } from "../../Editor/PathFinderOptions";
import { AStarSeeker } from "../AStar/AStarSeeker";
import { Float } from "../Basic/Float";
import { withVec3 } from "../Basic/ObjectPool";
import { MyProfiler } from "../Basic/Profiler";
import { Vector3 } from "../Basic/Vector";
import { AstarWorkItem, TWorkItemInit, TWorkItemUpdater } from "./AstarWorkItem";
import { bool, float, GraphNode, int, NavGraph } from "./CompatDef";
import { GridGraph } from "./GridGenerator";
import { GridNode } from "./GridNode";
import { HierarchicalGraph } from "./HierarchicalGraph";
import { NNConstraint, NNInfo, NNInfoInternal } from "./NNInfo/astarclasses";
import { PathProcessor } from "./PathProcessor";
import { ProceduralGridMover } from "./ProceduralGridMover";
import { WorkItemProcessor } from "./WorkItemProcessor";

export class AstarPath {
	private static _active: AstarPath;
	public static get active(): AstarPath {
		if (this._active == null) {
			this._active = new AstarPath();
		}
		return this._active;
	}

	public readonly hierarchicalGraph: HierarchicalGraph = new HierarchicalGraph();

	readonly workItems: WorkItemProcessor = new WorkItemProcessor();

	protected pathProcessor: PathProcessor = new PathProcessor(this);

	protected _AddWorkItem(item: AstarWorkItem) {
		this.workItems.AddWorkItem(item);
	}
	public AddWorkItem(init?: TWorkItemInit, update?: TWorkItemUpdater) {
		this._AddWorkItem(new AstarWorkItem(init, update))
	}

	options: PathFinderOptions[] = []

	graphs: GridGraph[] = []

	gridMovers: ProceduralGridMover[] = []

	seeker: AStarSeeker = new AStarSeeker()

	graphic: Graphics | null = null
	graphicRoot: Node | null = null

	/**
	 * 初始化
	 */
	init() {
		var gridMovers = this.gridMovers
		for (var graph of this.options) {
			var gridMover = new ProceduralGridMover();
			gridMover.Init(graph);
			gridMovers.push(gridMover);
		}
	}

	get gridGraph(): GridGraph {
		return this.graphs[0]
	}

	GetNodes(call: (node: any) => void) {
		for (let i = 0; i < this.graphs.length; i++) {
			if (this.graphs[i] != null) this.graphs[i].GetNodes(call);
		}
	}

	public fullGetNearestSearch: bool = false;
	public prioritizeGraphs: bool = false;

	/// <summary>
	/// Distance limit for <see cref="prioritizeGraphs"/>.
	/// See: <see cref="prioritizeGraphs"/>
	/// </summary>
	public prioritizeGraphsLimit: float = 1;

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
	public maxNearestNodeDistance: float = 100;

	/// <summary>
	/// Max Nearest Node Distance Squared.
	/// See: <see cref="maxNearestNodeDistance"/>
	/// </summary>
	public get maxNearestNodeDistanceSqr(): float {
		return this.maxNearestNodeDistance * this.maxNearestNodeDistance;
	}

	public GetNearest(position: Vector3, constraint: NNConstraint, hint: GraphNode): NNInfo {
		// Cache property lookup
		var graphs = this.graphs;

		var minDist: float = Float.PositiveInfinity;
		var nearestNode: NNInfoInternal = new NNInfoInternal();
		var nearestGraph: int = -1;

		if (graphs != null) {
			for (let i = 0; i < graphs.length; i++) {
				let graph: NavGraph = graphs[i];

				// Check if this graph should be searched
				if (graph == null || !constraint.SuitableGraph(i, graph)) {
					continue;
				}

				let nnInfo: NNInfoInternal = new NNInfoInternal();
				if (this.fullGetNearestSearch) {
					// Slower nearest node search
					// this will try to find a node which is suitable according to the constraint
					nnInfo = graph.GetNearestForce(position, constraint);
				} else {
					// Fast nearest node search
					// just find a node close to the position without using the constraint that much
					// (unless that comes essentially 'for free')
					nnInfo = graph.GetNearest(position, constraint);
				}

				let node: GraphNode = nnInfo.node;

				// No node found in this graph
				if (node == null) {
					continue;
				}

				// Distance to the closest point on the node from the requested position
				var dist: float = withVec3(cv1 => (cv1.set(nnInfo.clampedPosition).subtract(position)).length());

				if (this.prioritizeGraphs && dist < this.prioritizeGraphsLimit) {
					// The node is close enough, choose this graph and discard all others
					minDist = dist;
					nearestNode = nnInfo;
					nearestGraph = i;
					break;
				} else {
					// Choose the best node found so far
					if (dist < minDist) {
						minDist = dist;
						nearestNode = nnInfo;
						nearestGraph = i;
					}
				}
			}
		}

		// No matches found
		if (nearestGraph == -1) {
			return new NNInfo();
		}

		// Check if a constrained node has already been set
		if (nearestNode.constrainedNode != null) {
			nearestNode.node = nearestNode.constrainedNode;
			nearestNode.clampedPosition = nearestNode.constClampedPosition;
		}

		if (!this.fullGetNearestSearch && nearestNode.node != null && !constraint.Suitable(nearestNode.node)) {
			// Otherwise, perform a check to force the graphs to check for a suitable node
			var nnInfo: NNInfoInternal = graphs[nearestGraph].GetNearestForce(position, constraint);

			if (nnInfo.node != null) {
				nearestNode = nnInfo;
			}
		}

		if (!constraint.Suitable(nearestNode.node) || (constraint.constrainDistance && withVec3(cv1 => cv1.set(nearestNode.clampedPosition).subtract(position).lengthSqr()) > this.maxNearestNodeDistanceSqr)) {
			return new NNInfo();
		}

		// Convert to NNInfo which doesn't have all the internal fields
		return new NNInfo(nearestNode);
	}

	public GetNearestNode(position: Vec3, constraint?: NNConstraint, end?: Vec3): NNInfo {
		var minDist: float = Float.PositiveInfinity;
		var nearestNode: GridNode | undefined
		var nearestGraph: int = -1;

		let graphs = this.graphs
		for (let i = 0; i < graphs.length; i++) {
			let graph: NavGraph = graphs[i];
			let node = graph.GetNearestNode(position, end, constraint)

			if (node == null) {
				continue;
			}

			// Distance to the closest point on the node from the requested position
			var dist: float = (node.position.asVec3().subtract(position)).length();
			if (dist < minDist) {
				minDist = dist;
				nearestNode = node;
				nearestGraph = i;
			}
		}

		// return nearestNode
		return new NNInfo(new NNInfoInternal(nearestNode))
	}

	public DestroyNode(node: GraphNode): void {
		this.pathProcessor.DestroyNode(node);
	}

	/**
	 * 扫描地图
	 */
	scanGraph() {
		MyProfiler.BeginSample("scanGraph")
		var gridMovers = this.gridMovers
		for (var gridMover of gridMovers) {
			gridMover.scan();
		}

		this.seeker.UpdateGraph(this.graphs)

		this.onWorkDone()
		MyProfiler.EndSample()
		MyProfiler.TypeCurCost()
	}

	protected onWorkDone() {
		this.workDoneCount++

		this.workItems.ProcessWorkItemsDone()
	}

	protected workDoneCount = 0
	protected scanGraphAsyncTask?: Promise<any>
	public get awaitScanGraphTask() {
		return this.scanGraphAsyncTask
	}
	public get isWorkDone() {
		return this.workDoneCount > 0 && this.scanGraphAsyncTask == null
	}
	/**
	 * 扫描地图
	 */
	async scanGraphAsync() {
		if (this.scanGraphAsyncTask != null) {
			return
		}

		MyProfiler.BeginSample("scanGraphAsync")
		var gridMovers = this.gridMovers
		var waitList: Promise<void>[] = []
		for (var gridMover of gridMovers) {
			var waitor = gridMover.scanAsync();
			waitList.push(waitor)
		}

		var task1 = Promise.all(waitList)
		var task2 = (async () => {
			await task1
			this.seeker.UpdateGraph(this.graphs)
			this.scanGraphAsyncTask = undefined

			this.onWorkDone()
		})()

		this.scanGraphAsyncTask = task2
		await task2


		MyProfiler.EndSample()
		MyProfiler.TypeCurCost()

	}

	/**
	 * 绘制地图调试信息
	 */
	drawDebug() {
		for (var graph of this.graphs) {
			graph.clearDebug()
		}
		for (var graph of this.graphs) {
			graph.drawDebug()
		}
	}

}
