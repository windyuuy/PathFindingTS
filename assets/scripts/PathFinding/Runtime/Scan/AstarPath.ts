import { Graphics, Node } from "cc";
import { PathFinderOptions } from "../../Editor/PathFinderOptions";
import { AStarSeeker } from "../AStar/AStarSeeker";
import { AstarWorkItem, TWorkItemInit, TWorkItemUpdater } from "./AstarWorkItem";
import { GridGraph } from "./GridGenerator";
import { ProceduralGridMover } from "./ProceduralGridMover";
import { WorkItemProcessor } from "./WorkItemProcessor";

export class AstarPath {
	public static readonly active: AstarPath = new AstarPath();
	readonly workItems: WorkItemProcessor = new WorkItemProcessor();

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
	/**
	 * 扫描地图
	 */
	scanGraph() {
		var gridMovers = this.gridMovers
		for (var gridMover of gridMovers) {
			gridMover.scan();
		}

		this.seeker.UpdateGraph(this.graphs)

		this.onWorkDone()
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
