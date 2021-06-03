

import { _decorator, Component, Node, Vec3 } from 'cc';
import { AstarPath } from "../Scan/AstarPath";
import { OnPathDelegate } from "./AStarSeeker";
import { SeekResult } from "./SeekResult";
const { ccclass, property } = _decorator;

type Vector3 = Vec3

@ccclass('Seeker')
// @_decorator.executeInEditMode
export class Seeker extends Component {
	public StartPath(start: Vector3, end: Vector3, call?: OnPathDelegate): SeekResult | undefined {
		return AstarPath.active.seeker.StartPath(start, end, call)
	}
}
