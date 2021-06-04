import { Vec3 } from "cc";

export class TestCase {
	start!: Vec3
	end!: Vec3
	expectPaths?: Vec3[]
	paths!: Vec3[]

	constructor(start: Vec3, end: Vec3, expectPaths?: Vec3[]) {
		this.start = start
		this.end = end
		this.expectPaths = expectPaths
	}

	check(): boolean {
		if (this.expectPaths != null) {
			if (this.expectPaths.length != this.paths.length) {
				return false
			}
			for (var i = 0; i < this.expectPaths.length; i++) {
				var matched = this.expectPaths[i].equals(this.paths[i])
				if (!matched) {
					return false
				}
			}

			return true
		}

		return true
	}
}
