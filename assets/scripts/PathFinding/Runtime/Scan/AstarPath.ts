import { AstarWorkItem } from "./AstarWorkItem";
import { WorkItemProcessor } from "./WorkItemProcessor";

export class AstarPath {
	public static readonly active: AstarPath = new AstarPath();
	readonly workItems: WorkItemProcessor = new WorkItemProcessor();

	public AddWorkItem(item: AstarWorkItem) {
		this.workItems.AddWorkItem(item);
	}
}
