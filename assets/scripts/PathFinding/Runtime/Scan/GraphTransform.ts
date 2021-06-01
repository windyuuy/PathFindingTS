import { Mat4, Quat, Vec3 } from "cc";

export class GraphTransform {

	constructor(m: Mat4) {
		this.matrix = m;
		Mat4.invert(this.inverseMatrix, this.inverseMatrix)
		this.up = Vec3.UP.clone().transformMat4(m).normalize()
	}

	public onlyTranslational: boolean = false

	matrix: Mat4 = new Mat4()
	inverseMatrix: Mat4 = new Mat4()

	public Transform(point: Vec3 | Readonly<Vec3>): Vec3 {
		var ret = point.clone();
		ret.transformMat4(this.matrix);
		return ret;
	}

	up!: Vec3;
	public WorldUpAtGraphPosition(point: Vec3): Vec3 {
		return this.up;
	}

	public InverseTransform(point: Vec3): Vec3 {
		var ret = point.clone();
		ret.transformMat4(this.inverseMatrix);
		return ret;
	}

	public TransformVector(point: Vec3): Vec3 {
		var ret = point.clone();
		ret.transformMat4(this.matrix);
		return ret;
	}

}
