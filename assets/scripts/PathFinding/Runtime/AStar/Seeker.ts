

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
	needDrawDebug: boolean = false

	@property({
		displayName: "绘制线宽度",
	})
	lineWidth: number = 0.1

	public startPath(start: Vector3, end: Vector3, call?: OnPathDelegate): SeekResult | undefined {
		var result = AstarPath.active.seeker.StartPath(start, end, call)
		if (this.needDrawDebug) {
			result?.drawDebug(this.lineWidth)
		}
		return result
	}
}
