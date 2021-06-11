import { Vec3 } from "cc";
import { int3Pool, vec3Pool } from "../Basic/ObjectPool";


export class Int3 {
	/**
	 * @en x component.
	 * @zh x 分量。
	 */
	x: number = 0;
	/**
	 * @en y component.
	 * @zh y 分量。
	 */
	y: number = 0;
	/**
	 * @en z component.
	 * @zh z 分量。
	 */
	z: number = 0;

	public static readonly Precision: number = 1000;
	public static readonly FloatPrecision: number = 1000;
	public static readonly PrecisionFactor: number = 0.001;

	public static fromVec3(ob: Vec3): Int3 {
		// var int3 = new Int3()
		var int3 = int3Pool.tempNow()
		int3.x = Math.round(ob.x * Int3.FloatPrecision)
		int3.y = Math.round(ob.y * Int3.FloatPrecision)
		int3.z = Math.round(ob.z * Int3.FloatPrecision)
		return int3
	}

	public reset(): Int3 {
		this.x = 0
		this.y = 0
		this.z = 0
		return this
	}

	public set(ob: Int3): Int3 {
		this.x = ob.x
		this.y = ob.y
		this.z = ob.z
		return this
	}

	public setVec3(ob: Vec3): Int3 {
		this.x = Math.round(ob.x * Int3.FloatPrecision)
		this.y = Math.round(ob.y * Int3.FloatPrecision)
		this.z = Math.round(ob.z * Int3.FloatPrecision)
		return this
	}

	public asVec3(vec3?: Vec3) {
		// var vec3 = new Vec3()
		if (vec3 == null) {
			vec3 = vec3Pool.tempNow()
		}
		vec3.x = this.x * Int3.PrecisionFactor
		vec3.y = this.y * Int3.PrecisionFactor
		vec3.z = this.z * Int3.PrecisionFactor
		return vec3
	}

	public distance(vec3: Int3) {
		let dx = this.x - vec3.x
		let dy = this.y - vec3.y
		let dz = this.z - vec3.z
		return Math.sqrt((dx * dx + dy * dy * dz * dz)) * Int3.PrecisionFactor
	}

	public get magnitude(): number {
		//It turns out that using doubles is just as fast as using ints with Mathf.Sqrt. And this can also handle larger numbers (possibly with small errors when using huge numbers)!

		var _x: number = this.x;
		var _y: number = this.y;
		var _z: number = this.z;

		return Math.sqrt(_x * _x + _y * _y + _z * _z);
	}

	public get costMagnitude(): number {
		return Math.round(this.magnitude);
	}

	public clone() {
		var vec = new Int3()
		vec.x = this.x
		vec.y = this.y
		vec.z = this.z
		return vec
	}

	recycle() {
		this.reset()
		int3Pool.recycle(this)
	}
}
