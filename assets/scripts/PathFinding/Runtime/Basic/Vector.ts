import { Mat4, Quat, Vec3 } from "cc";
import { FP } from "../Scan/CompatDef";
import { withVec3 } from "./ObjectPool";

export class Vector {
	public static distance(start: Vec3, end: Vec3) {
		return withVec3(cv1 => cv1.set(start).subtract(end).length())
	}
	public static distanceSQ(start: Vec3, end: Vec3) {
		return withVec3(cv1 => cv1.set(start).subtract(end).lengthSqr())
	}
}

const sharedVec3 = new Vec3()
const sharedMat4 = new Mat4()
const sharedQuat = new Quat()
export class Vector3 extends Vec3 {
	static RotateTowards(out: Vec3, forward: Vec3, pos: Vec3, arg2: number, arg3: number): Vec3 {
		out.x = forward.x
		out.y = forward.y
		out.z = forward.z
		return out
	}
	// static RotateTowards(forward: Vec3, pos: Vec3, maxRadiansDelta: FP, maxMagnitudeDelta: FP): Vec3 {
	// 	let axis = forward.alloc()
	// 	axis.normalize()
	// 	var axism = new Vec3(axis.z, axis.x, axis.y);
	// 	var axis1 = axis.alloc().cross(axism)
	// 	var axis2 = axis.alloc().cross(axis1)
	// 	Quat.fromAxes(sharedQuat, axis, axis1, axis2)
	// }
	public static rotate(out: Vec3, quat: Quaternion, vec3: Vec3) {
		Vector3.transformQuat(out, vec3, quat)
	}
}

export class Quaternion extends Quat {
	public static AngleAxis(out: Quaternion, angle: FP, axis: Vector3) {
		return Quaternion.fromAxisAngle(out, axis, angle)
	}

	public static RotateByAxis(out: Vector3, angle: FP, axis: Vector3, direct: Vector3): Vector3 {
		this.AngleAxis(sharedQuat, angle, axis)
		// Vector3.rotate(out, sharedQuat, direct)
		Vector3.transformQuat(out, direct, sharedQuat)
		return out
	}
}
