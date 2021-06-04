import { Graphics, Node } from "cc";
import { PathFinderOptions } from "../../Editor/PathFinderOptions";
import { AStarSeeker } from "../AStar/AStarSeeker";
import { AstarWorkItem } from "./AstarWorkItem";
import { GridGraph } from "./GridGenerator";
import { ProceduralGridMover } from "./ProceduralGridMover";
import { WorkItemProcessor } from "./WorkItemProcessor";

export class AstarPath {
	public static readonly active: AstarPath = new AstarPath();
	readonly workItems: WorkItemProcessor = new WorkItemProcessor();

	public AddWorkItem(item: AstarWorkItem) {
		this.workItems.AddWorkItem(item);
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
	}

	/**
	 * 绘制地图调试信息
	 */
	drawDebug() {
		for (var graph of this.graphs) {
			graph.clearDebug()
			graph.drawDebug()
		}
	}

}
