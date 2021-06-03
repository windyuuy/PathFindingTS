import { Vec3 } from "cc";
import { ANode } from "./AStarLib/core/node";

type Vector3 = Vec3

export class SeekResult {
	/**
	 * 是否存在路径
	 */
	public isOk: boolean = false
	public vectorPath: Vector3[] = []
	public vectorPathRaw: Vector3[] = []
	public nodes: ANode[] = []
}
