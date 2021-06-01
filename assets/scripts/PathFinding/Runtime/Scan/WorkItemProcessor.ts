import { AstarWorkItem } from "./AstarWorkItem";

export class WorkItemProcessor {
	readonly workItems: AstarWorkItem[] = []

	public AddWorkItem(item: AstarWorkItem) {
		this.workItems.push(item);
	}

}
