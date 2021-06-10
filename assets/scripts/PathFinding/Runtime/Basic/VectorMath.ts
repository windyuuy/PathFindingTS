import { Vec3 } from "cc";
import { float } from "../Scan/CompatDef";
import { withVec3 } from "./ObjectPool";

export class VectorMath {
	public static ClosestPointOnLine(lineStart: Vec3, lineEnd: Vec3, point: Vec3) {
		return withVec3((cv1, cv2, cv3, cv4) => {
			let lineDirection: Vec3 = Vec3.normalize(cv1, cv1.set(lineEnd).subtract(lineStart));
			let dot: float = Vec3.dot(cv2.set(point).subtract(lineStart), lineDirection);

			return cv3.set(lineStart).add(cv4.set(lineDirection).multiplyScalar(dot)).tempClone()
		})
	}
}
