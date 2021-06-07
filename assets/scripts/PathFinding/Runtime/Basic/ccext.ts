import { Vec3 } from "cc";
import { vec3Pool } from "./ObjectPool";

declare module "cc" {
	export namespace math {
		interface Vec3 {
			alloc(): this
			release(): void
			allocClone(): this
			reset(): this
			tempClone(): this
			image(v: this): this
		}
	}
}

Vec3.prototype.alloc = function (): Vec3 {
	return vec3Pool.obtain()
}

Vec3.prototype.allocClone = function (): Vec3 {
	return vec3Pool.obtain().set(this)
}

Vec3.prototype.release = function (): void {
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
	c.set(this)
	return c
}

Vec3.prototype.image = function (v: Vec3): Vec3 {
	v.set(this)
	return v
}
