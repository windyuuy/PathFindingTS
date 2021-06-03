import { Vec3 } from "cc";


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

	public static Precision: number = 1000;
	public static FloatPrecision: number = 1000;
	public static PrecisionFactor: number = 0.001;

	public static fromVec3(ob: Vec3): Int3 {
		var int3 = new Int3()
		int3.x = Math.round(ob.x * Int3.FloatPrecision)
		int3.y = Math.round(ob.y * Int3.FloatPrecision)
		int3.z = Math.round(ob.z * Int3.FloatPrecision)
		return int3
	}

	public asVec3() {
		var vec3 = new Vec3()
		vec3.x = this.x * Int3.PrecisionFactor
		vec3.y = this.y * Int3.PrecisionFactor
		vec3.z = this.z * Int3.PrecisionFactor
		return vec3
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
}
