import { Mat4, Quat, Vec3 } from "cc";
import { Matrix4 } from "../Basic/Matrix";

export class GraphTransform {

	constructor(m: Mat4) {
		this.matrix = m;
		Mat4.invert(this.inverseMatrix, this.matrix)

		Matrix4.MultiplyVector(this.up, m, Vec3.UP);
	}

	public onlyTranslational: boolean = false

	matrix: Mat4 = new Mat4()
	inverseMatrix: Mat4 = new Mat4()

	public Transform(out: Vec3, point: Vec3 | Readonly<Vec3>): Vec3 {
		out.set(point)
		out.transformMat4(this.matrix);
		return out;
	}

	up: Vec3 = new Vec3();
	public WorldUpAtGraphPosition(point: Vec3): Vec3 {
		return this.up.tempClone()
	}

	public InverseTransform(out: Vec3, point: Vec3): Vec3 {
		out.set(point)
		out.transformMat4(this.inverseMatrix);
		return out;
	}

	public TransformVector(out: Vec3, point: Vec3): Vec3 {
		Matrix4.MultiplyVector(out, this.matrix, point);
		return out;
	}

}
