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

	public Transform(point: Vec3 | Readonly<Vec3>): Vec3 {
		var ret = point.clone();
		ret.transformMat4(this.node.matrix);
		return ret;
	}

}
