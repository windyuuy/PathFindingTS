

import { _decorator, Component, Node, Vec3 } from 'cc';
import { AstarPath } from "../Scan/AstarPath";
import { OnPathDelegate } from "./AStarSeeker";
import { SeekResult } from "./SeekResult";
const { ccclass, property } = _decorator;

type Vector3 = Vec3

@ccclass('Seeker')
// @_decorator.executeInEditMode
export class Seeker extends Component {
	@property({
		displayName: "绘制寻路线段",
	})
	needDrawDebug: boolean = true

	@property({
		displayName: "绘制线宽度",
	})
	lineWidth: number = 0.1

	result?: SeekResult

	public async startPath(start: Vector3, end: Vector3, call?: OnPathDelegate): Promise<SeekResult> {
		var task = AstarPath.active.awaitScanGraphTask
		if (task != null) {
			await task
		}

		if (this.result != null) {
			this.result.clearDebug()
		}

		var result = AstarPath.active.seeker.StartPath(start, end, call)
		if (this.needDrawDebug) {
			result?.drawDebug(this.lineWidth)
		}
		this.result = result
		return result
	}
}
