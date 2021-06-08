import { Node, Quat, Vec3 } from "cc";

export class Transform {
	protected node: Node

	constructor(node: Node) {
		this.node = node
	}

	get position(): Vec3 {
		return this.node.position
	}
	set position(value: Vec3) {
		this.node.position = value
	}

	get rotation(): Quat {
		return this.node.rotation;
	}
	set rotation(value: Quat) {
		this.node.rotation = value
	}

	get scale(): Vec3 {
		return this.node.scale
	}
	set scale(value: Vec3) {
		this.node.scale = value
	}

	public Transform(out: Vec3, point: Vec3 | Readonly<Vec3>): Vec3 {
		out.set(point)
		out.transformMat4(this.node.matrix);
		return out;
	}

}
