import { Mat4, Vec3 } from "cc";

export class Matrix4 {
	public static MultiplyVector(out: Vec3, m: Mat4, vector: Vec3) {
		var x = (m.m00 * vector.x + m.m04 * vector.y + m.m08 * vector.z);
		var y = (m.m01 * vector.x + m.m05 * vector.y + m.m09 * vector.z);
		var z = (m.m02 * vector.x + m.m06 * vector.y + m.m10 * vector.z);

		out.x = x
		out.y = y
		out.z = z

		return out;
	}

}
