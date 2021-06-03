import { Mat4, Quat, Vec3 } from "cc";
import { Matrix4 } from "../Basic/Matrix";

export class GraphTransform {

	constructor(m: Mat4) {
		this.matrix = m;
		Mat4.invert(this.inverseMatrix, this.matrix)

		// var upM = new Mat4()
		// var up = Vec3.UP.clone().transformMat4(m)
		// this.up = .normalize()
		Matrix4.MultiplyVector(this.up, m, Vec3.UP);
	}

	public onlyTranslational: boolean = false

	matrix: Mat4 = new Mat4()
	inverseMatrix: Mat4 = new Mat4()

	public Transform(point: Vec3 | Readonly<Vec3>): Vec3 {
		var ret = point.clone();
		ret.transformMat4(this.matrix);
		return ret;
	}

	up: Vec3 = new Vec3();
	public WorldUpAtGraphPosition(point: Vec3): Vec3 {
		return this.up.clone();
	}

	public InverseTransform(point: Vec3): Vec3 {
		var ret = point.clone();
		ret.transformMat4(this.inverseMatrix);
		return ret;
	}

	public TransformVector(point: Vec3): Vec3 {
		var ret = new Vec3()
		Matrix4.MultiplyVector(ret, this.matrix, point);
		return ret;
	}

}
