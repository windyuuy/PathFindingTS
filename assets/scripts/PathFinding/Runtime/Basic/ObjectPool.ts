import { Color, Mat4, Quat, Vec2, Vec3, Vec4 } from "cc"
import { Int3 } from "../Scan/Int3"

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
		if ((v as any)["__$tmp"]) {
			(v as any)["__$tmp"] = false;
		}
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

	private statisticMap: { [key: string]: number } = Object.create(null)
	private _record(key: string) {
		let n = this.statisticMap[key] ?? (this.statisticMap[key] = 0)
		this.statisticMap[key]++
	}

	protected releaseTimerId: any
	protected obtainOnceList: T[] = []

	protected enableRecord: boolean = true
	tempNow(): T {
		var ret = this.obtain();
		(ret as any)["__$tmp"] = true;
		this.obtainOnceList.push(ret);

		if (this.enableRecord) {
			(ret as any)["__$stack"] = new Error().stack!;
		}

		if (this.releaseTimerId == null) {
			this.releaseTimerId = setInterval(() => {
				for (let o of this.obtainOnceList) {
					if ((o as any)["__$tmp"]) {
						if (this.enableRecord) {
							this._record((ret as any)["__$stack"])
						}
						this.recycle(o)
					}
				}
				this.obtainOnceList.clear()
			}, 1)
		}
		return ret
	}
	recycleTemp(value: T) {
		this.obtainOnceList.remove(value)
		this.recycle(value)
	}
	stopRecycleTask() {
		if (this.releaseTimerId != null) {
			clearInterval(this.releaseTimerId)
			this.releaseTimerId = undefined
		}
	}
	markTemp(o: T) {
		if (false == (o as any)["__$tmp"]) {
			(o as any)["__$tmp"] = true;
			this.obtainOnceList.push(o);
		}
	}

}

export const listPool = new ObjectPool(() => new Array())
export const vec2Pool = new ObjectPool(() => new Vec2())
export const vec3Pool = new ObjectPool(() => new Vec3())
export const vec4Pool = new ObjectPool(() => new Vec4())
export const quatPool = new ObjectPool(() => new Quat())
export const colorPool = new ObjectPool(() => new Color())
export const mat4Pool = new ObjectPool(() => new Mat4())
export const int3Pool = new ObjectPool(() => new Int3())

export function withVec3<T>(handle: (...value: Vec3[]) => T) {
	return vec3Pool.with(handle)
}

export function withQuat<T>(handle: (...value: Quat[]) => T) {
	return quatPool.with(handle)
}

export function withMat4<T>(handle: (...value: Mat4[]) => T) {
	return mat4Pool.with(handle)
}
