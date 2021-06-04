import { IWorkItemContext, WorkItemProcessor } from "./WorkItemProcessor"

export type TWorkItemUpdater = (a: WorkItemProcessor, b: boolean, c: boolean) => void
export type TWorkItemInit = (a: IWorkItemContext) => void
export class AstarWorkItem {
	public updateWithContext?: TWorkItemUpdater
	public initWithContext?: TWorkItemInit

	constructor(init?: TWorkItemInit, update?: TWorkItemUpdater) {
		this.initWithContext = init
		this.updateWithContext = update
	}
}
