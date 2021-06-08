import { Vec3 } from "cc";
import { vec3Pool } from "./ObjectPool";

declare module "cc" {
	export namespace math {
		interface Vec3 {
			/**
			 * @en Set the current vector value with the given vector.
			 * @zh 设置当前向量使其与指定向量相等。
			 * @param other Specified vector
			 * @returns `this`
			 */
			set(other: Vec3): this;
			/**
			 * @en Set the value of each component of the current vector.
			 * @zh 设置当前向量的具体分量值。
			 * @param x x value
			 * @param y y value
			 * @param z z value
			 * @returns `this`
			 */
			set(x?: number, y?: number, z?: number): this;

			zero(): this
			recycle(): void
			autorecycle(): this
			alloc(): this
			reset(): this
			tempClone(): this
			image(v: this): this
		}
	}
}

Vec3.prototype.zero = function (): Vec3 {
	return vec3Pool.obtain()
}

Vec3.prototype.alloc = function (): Vec3 {
	return vec3Pool.obtain().set(this)
}

Vec3.prototype.recycle = function (): void {
	this.reset()
	vec3Pool.recycle(this)
}

Vec3.prototype.reset = function (): Vec3 {
	this.x = 0
	this.y = 0
	this.z = 0
	return this
}

Vec3.prototype.tempClone = function (): Vec3 {
	var c = vec3Pool.tempNow()
	// var c = new Vec3()
	c.set(this)
	return c
}

Vec3.prototype.image = function (v: Vec3): Vec3 {
	v.set(this)
	return v
}

Vec3.prototype.autorecycle = function (): Vec3 {
	vec3Pool.markTemp(this)
	return this
}