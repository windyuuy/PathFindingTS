import { Graphics, Node } from "cc";
import { PathFinderOptions } from "../../Editor/PathFinderOptions";
import { AStarSeeker } from "../AStar/AStarSeeker";
import { AstarWorkItem, TWorkItemInit, TWorkItemUpdater } from "./AstarWorkItem";
import { GraphNode } from "./CompatDef";
import { GridGraph } from "./GridGenerator";
import { HierarchicalGraph } from "./HierarchicalGraph";
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

	GetNodes(call: (node: any) => void) {
		for (let i = 0; i < this.graphs.length; i++) {
			if (this.graphs[i] != null) this.graphs[i].GetNodes(call);
		}
	}

	public DestroyNode(node: GraphNode): void {
		this.pathProcessor.DestroyNode(node);
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
