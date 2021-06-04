import * as cc from "cc";
import { PathFinderDebugDrawOptions } from "../../Editor/PathFinderDebugDrawOptions";
import { AstarPath } from "../Scan/AstarPath";
import { GridGraph } from "../Scan/GridGenerator";
import { ANode } from "./AStarLib/core/node";

type Vector3 = cc.Vec3

export class SeekResult {
	/**
	 * 是否存在路径
	 */
	public isOk: boolean = false
	public vectorPath: Vector3[] = []
	public vectorPathRaw: Vector3[] = []
	public nodes: ANode[] = []
	public graph!: GridGraph

	get graphic() {
		return AstarPath.active.graphic
	}

	get graphicRoot() {
		return AstarPath.active.graphicRoot
	}

	setCylinder(index: number, start: cc.Vec3, end: cc.Vec3, lineWidth: number, up: cc.Vec3, options: PathFinderDebugDrawOptions) {
		// start.y = 0
		// end.y = 0
		var scale = lineWidth
		var upOffset = options.upOffset
		cc.resources.load<cc.Prefab>("PathFinding/Res/PathHint/PathHint", (err, shapePrefab) => {
			var axis = end.clone().subtract(start)

			var node = cc.instantiate(shapePrefab) as cc.Node
			node.name = "line"

			var width = axis.length();
			var bodyShape = cc.find("Body", node)!
			bodyShape.scale = new cc.Vec3(width, scale, scale)

			var headShape = cc.find("Sphere1", node)!
			var endShape = cc.find("Sphere2", node)!
			headShape.position = new cc.Vec3(width / 2, 0, 0)
			endShape.position = new cc.Vec3(-width / 2, 0, 0)
			headShape.setScale(scale, scale, scale)
			endShape.setScale(scale, scale, scale)

			// TODO: 需要根据镜头宽度智能调整尺寸
			var headMark = cc.find("HeadMark", node)!
			headMark.position = new cc.Vec3(-width / 2, 0, 0)
			headMark.setScale(scale, scale, scale)
			headMark.active = index == 0

			var center = start.clone().add(end).multiplyScalar(0.5)

			if (upOffset != 0) {
				center.add(up.clone().multiplyScalar(upOffset))
			}

			node.position = center

			var rot = new cc.Quat()
			axis.normalize()
			var axism = new cc.Vec3(axis.z, axis.y, axis.x);
			var axis1 = axis.clone().cross(axism)
			var axis2 = axis.clone().cross(axis1)
			// cc.Quat.fromViewUp(rot, axis, axis1)
			cc.Quat.fromAxes(rot, axis, axis1, axis2)
			node.rotation = rot

			node.parent = this.graphicRoot
		})
	}

	drawDebug(lineWidth: number) {
		var options = this.graph.debugDrawOptions
		if (!options.enableGraphicDrawer) {
			return
		}
		if (!options.needDrawFindingPath) {
			return
		}

		var up = this.graph.up
		if (this.vectorPath.length >= 2) {
			var first = this.vectorPath[0]
			for (var i = 1; i < this.vectorPath.length; i++) {
				var next = this.vectorPath[i]
				this.setCylinder(i - 1, first.clone(), next.clone(), lineWidth, up, options)
				first = next
			}
		}
	}
}
