import { WorkItemProcessor } from "./WorkItemProcessor"

export type TWorkItemUpdater = (a: WorkItemProcessor, b: boolean, c: boolean) => void
export class AstarWorkItem {
	public update!: TWorkItemUpdater

	constructor(update: TWorkItemUpdater) {
		this.update = update
	}
}
