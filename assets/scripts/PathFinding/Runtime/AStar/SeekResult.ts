import { Vec3 } from "cc";

type Vector3 = Vec3

export class SeekResult {
	/**
	 * 是否存在路径
	 */
	public isOk: boolean = false
	public vectorPath: Vector3[] = []
}
