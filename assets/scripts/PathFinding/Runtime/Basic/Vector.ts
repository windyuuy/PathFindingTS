import { Vec3 } from "cc";

export class Vector {
	public static distance(start: Vec3, end: Vec3) {
		return start.clone().subtract(end).length()
	}
	public static distanceSQ(start: Vec3, end: Vec3) {
		return start.clone().subtract(end).lengthSqr()
	}
}
