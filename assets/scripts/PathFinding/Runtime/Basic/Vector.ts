import { Mat4, Quat, Vec3 } from "cc";
import { FP } from "../Scan/CompatDef";
import { Float } from "./Float";
import { withQuat, withVec3 } from "./ObjectPool";

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
	public static rotate(out: Vec3, quat: Quaternion, vec3: Vec3) {
		Vector3.transformQuat(out, vec3, quat)
		return out
	}

	protected static readonly VECTORMATH_SLERP_TOL = 0.999
	static slerpUnclamped(out: Vec3, unitVec0: Vec3, unitVec1: Vec3, t: number): Vec3 {
		let recipSinAngle: number, scale0: number, scale1: number, cosAngle: number, angle: number;

		cosAngle = Vec3.dot(unitVec0, unitVec1);
		if (cosAngle < this.VECTORMATH_SLERP_TOL) {
			angle = Math.acos(cosAngle);
			recipSinAngle = (1.0 / Math.sin(angle));
			scale0 = (Math.sin(((1.0 - t) * angle)) * recipSinAngle);
			scale1 = (Math.sin((t * angle)) * recipSinAngle);
		}
		else {
			scale0 = (1.0 - t);
			scale1 = t;
		}
		// return ((unitVec0 * scale0) + (unitVec1 * scale1));
		return withVec3((cv1, cv2) => {
			return Vec3.add(out,
				Vec3.multiplyScalar(cv1, unitVec0, scale0),
				Vec3.multiplyScalar(cv2, unitVec1, scale1)
			)
		})
	}

	public static normalizeR(out: Vec3, a: Vec3): number {
		const x = a.x;
		const y = a.y;
		const z = a.z;

		let len = x * x + y * y + z * z;
		if (len > 0) {
			let rlen = 1 / Math.sqrt(len);
			out.x = x * rlen;
			out.y = y * rlen;
			out.z = z * rlen;
		} else {
			out.set(a)
		}
		return len;
	}

	public static rotateTowards(out: Vec3, from: Vec3, to: Vec3, maxRadiansDelta: number, maxMagnitudeDelta: number): Vec3 {
		withVec3((cv1, cv2) => {
			let magFrom = this.normalizeR(cv1, from)
			let magTo = this.normalizeR(cv2, to)

			let delta = Vec3.angle(from, to) * Float.Deg2Rad
			let radDiff = Math.min(1, maxRadiansDelta / delta)
			Vector3.slerpUnclamped(out, cv1, cv2, radDiff)

			let magDiff = magTo - magFrom
			let magDelta = Math.sign(magDiff) * Math.min(maxMagnitudeDelta, Math.abs(magDiff))
			let mag = magFrom + magDelta

			out.multiplyScalar(mag)
		})

		return out
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

	public static add(out: Quat, a: Quat, b: Quat): Quat {
		out.x = a.x + b.x
		out.y = a.y + b.y
		out.z = a.z + b.z
		out.w = a.w + b.w

		return out
	}

	public static negative(out: Quat, a: Quat): Quat {
		out.x = -a.x
		out.y = -a.y
		out.z = -a.z
		out.w = -a.w

		return out
	}

	public static slerpUnclamped(out: Quat, from: Quat, to: Quat, rate: number): Quat {
		if (from.lengthSqr() == 0) {
			if (to.lengthSqr() == 0) {
				return out.set(Quat.IDENTITY)
			}
			return out.set(to)
		} else if (to.lengthSqr() == 0) {
			return out.set(from)
		}

		return withQuat((cq1, cq2, cq3) => {
			let cosHalfAngle = Quat.dot(from, to)
			if (cosHalfAngle >= 1.0 || cosHalfAngle <= -1.0) {
				return out.set(from)
			} else if (cosHalfAngle < 0.0) {
				to = Quaternion.negative(cq1, to)
				cosHalfAngle = -cosHalfAngle
			}

			let blendA: number;
			let blendB: number;

			if (cosHalfAngle < 0.99) {
				let halfAngle = Math.acos(cosHalfAngle)
				let sinHalfAngle = Math.sin(halfAngle)
				let onOverSinHalfAngle = 1.0 / sinHalfAngle
				blendA = Math.sin(halfAngle * (1.0 - rate)) * onOverSinHalfAngle
				blendB = Math.sin(halfAngle * rate) * onOverSinHalfAngle
			} else {
				blendA = 1.0 - rate
				blendB = rate
			}

			Quaternion.add(out,
				Quat.multiplyScalar(cq2, cq2.set(from), blendA),
				Quat.multiplyScalar(cq3, cq3.set(from), blendB)
			)

			if (out.lengthSqr() > 0.0) {
				return Quat.normalize(out, out)
			} else {
				return out.set(Quat.IDENTITY)
			}
		})

	}

	public static rotationTowards(out: Quat, from: Quat, to: Quat, maxDegreeDelta: number) {
		let num = Quaternion.dot(from, to)
		if (num == 0) {
			return out.set(to)
		}
		let rate = Math.min(1.0, maxDegreeDelta * Float.Deg2Rad / num)
		return this.slerpUnclamped(out, from, to, rate)
	}
}
