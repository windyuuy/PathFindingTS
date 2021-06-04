import { AstarWorkItem } from "./AstarWorkItem";

export interface IWorkItemContext { }

export class WorkItemProcessor implements IWorkItemContext {
	readonly workItems: AstarWorkItem[] = []

	public AddWorkItem(item: AstarWorkItem) {
		this.workItems.push(item);
	}

	public ProcessWorkItemsDone() {
		while (this.workItems.length > 0) {
			var item = this.workItems.shift()!
			if (item.initWithContext != null) {
				item.initWithContext(this)
			}

			if (item.updateWithContext != null) {
				item.updateWithContext(this, false, false)
			}
		}
	}

}
