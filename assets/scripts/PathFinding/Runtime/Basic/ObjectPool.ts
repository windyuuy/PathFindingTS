import { Color, Mat4, Quat, Vec2, Vec3, Vec4 } from "cc"

class ObjectPool<T>{
	protected pool: T[]
	protected creator: () => T
	constructor(creator: () => T) {
		this.pool = []
		this.creator = creator
	}

	obtain(): T {
		if (this.pool.length == 0) {
			return this.creator()
		} else {
			return this.pool.pop()!
		}
	}

	recycle(v: T) {
		this.pool.push(v)
	}

	using<F>(count: number, handle: (value: T[]) => F): F {
		const paras = listPool.obtain()
		for (var i = 0; i < count; i++) {
			paras.push(this.obtain())
		}
		var ret = handle(paras)
		paras.forEach(v => this.recycle(v))
		paras.clear()
		listPool.recycle(paras)
		return ret
	}

	with<F>(handle: (...value: T[]) => F): F {
		const paras = listPool.obtain()
		var count = handle.length
		for (var i = 0; i < count; i++) {
			paras.push(this.obtain())
		}
		var ret = handle.apply(this, paras)
		paras.forEach(v => this.recycle(v))
		paras.clear()
		listPool.recycle(paras)
		return ret
	}

	protected releaseTimerId: any
	protected obtainOnceList: T[] = []
	tempNow(): T {
		var ret = this.obtain()
		this.obtainOnceList.push(ret)

		if (this.releaseTimerId == null) {
			this.releaseTimerId = setInterval(() => {
				for (let o of this.obtainOnceList) {
					this.recycle(o)
				}
				this.obtainOnceList.clear()
			}, 1)
		}
		return ret
	}
	stopRecycleTask() {
		if (this.releaseTimerId != null) {
			clearInterval(this.releaseTimerId)
			this.releaseTimerId = undefined
		}
	}

}

export const listPool = new ObjectPool(() => new Array())
export const vec2Pool = new ObjectPool(() => new Vec2)
export const vec3Pool = new ObjectPool(() => new Vec3)
export const vec4Pool = new ObjectPool(() => new Vec4)
export const quatPool = new ObjectPool(() => new Quat)
export const colorPool = new ObjectPool(() => new Color)
export const mat4Pool = new ObjectPool(() => new Mat4)

export function withVec3<T>(handle: (...value: Vec3[]) => T) {
	return vec3Pool.with(handle)
}
