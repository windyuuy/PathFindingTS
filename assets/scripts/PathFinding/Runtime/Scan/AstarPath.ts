import { PathFinderOptions } from "../../Editor/PathFinderOptions";
import { AstarWorkItem } from "./AstarWorkItem";
import { ProceduralGridMover } from "./ProceduralGridMover";
import { WorkItemProcessor } from "./WorkItemProcessor";

export class AstarPath {
	public static readonly active: AstarPath = new AstarPath();
	readonly workItems: WorkItemProcessor = new WorkItemProcessor();

	public AddWorkItem(item: AstarWorkItem) {
		this.workItems.AddWorkItem(item);
	}

	graphs: PathFinderOptions[] = [new PathFinderOptions()]

	gridMovers: ProceduralGridMover[] = []
	/**
	 * 初始化
	 */
	init() {
		var gridMovers = this.gridMovers
		for (var graph of this.graphs) {
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
	}
}
