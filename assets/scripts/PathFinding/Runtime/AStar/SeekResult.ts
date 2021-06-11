import * as cc from "cc";
import { Vec3 } from "cc";
import { PathFinderDebugDrawOptions } from "../../Editor/PathFinderDebugDrawOptions";
import { MyNodePool } from "../Basic/NodePool/MyNodePool";
import { vec3Pool, withQuat, withVec3 } from "../Basic/ObjectPool";
import { AstarPath } from "../Scan/AstarPath";
import { GridGraph } from "../Scan/GridGenerator";
import { ANode } from "./AStarLib/core/node";
import { FindPathResult } from "./AStarLib/finders/astar-finder";
import { IPoint } from "./AStarLib/interfaces/astar.interfaces";

type Vector3 = cc.Vec3

export class SeekResult extends FindPathResult {
	/**
	 * 是否存在路径
	 */
	public ok: boolean = false

	start: Vec3 = new Vec3()
	end: Vec3 = new Vec3()

	protected _vectorPath?: Vector3[]
	public get vectorPath(): Vector3[] {
		if (this._vectorPath == null) {
			let vectorPath = this._vectorPath = this.vectorPathRaw.slice()
			// 处理起点终点不在网格中心的细节
			if (vectorPath.length > 0) {
				let start = this.start
				let end = this.end
				if (!vectorPath[0].equals(start)) {
					vectorPath.unshift(start)
				}
				if (!vectorPath[vectorPath.length - 1].equals(end)) {
					vectorPath.push(end)
				}
			}
		}
		return this._vectorPath
	}
	public set vectorPath(path: Vector3[]) {
		this._vectorPath = path
	}

	private _vectorPathRaw?: Vector3[]
	public get vectorPathRaw(): Vector3[] {
		if (this._vectorPathRaw == null) {
			this._vectorPathRaw = this.nodes.map(node => node.position.asVec3(vec3Pool.obtain()))
		}
		return this._vectorPathRaw;
	}

	protected _path?: IPoint[]
	public get paths(): IPoint[] {
		if (this._path == null) {
			this._path = this.nodes.map(node => ({ x: node.ipos.x, y: node.ipos.y }))
		}
		return this._path
	}
	public nodes: ANode[] = []
	public graph!: GridGraph

	reset() {
		this.nodes.clear()
	}

	public graphNodes: cc.Node[] = []
	public drawBatchId: number = 0
	public static drawBatchIdAcc: number = 0

	get graphic() {
		return AstarPath.active.graphic
	}

	get graphicRoot() {
		return AstarPath.active.graphicRoot
	}

	setCylinder(index: number, start: cc.Vec3, end: cc.Vec3, lineWidth: number, up: cc.Vec3,
		options: PathFinderDebugDrawOptions, drawBatchId: number) {
		start = start.alloc()
		end = end.alloc()
		var scale = lineWidth
		var upOffset = options.upOffset
		MyNodePool.load("PathHint", (node, err) => {
			start.autorecycle()
			end.autorecycle()

			if (drawBatchId != this.drawBatchId) {
				MyNodePool.put(node)
				return;
			}

			// cc.resources.load<cc.Prefab>("PathFinding/Res/PathHint/PathHint", (err, shapePrefab) => {
			// var node = cc.instantiate(shapePrefab) as cc.Node
			node.name = "PathLine"
			this.graphNodes.push(node)

			withVec3(axis => {
				axis.set(end).subtract(start)

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

				withVec3((cv1, cv2) => {
					let center = cv1.set(start).add(end).multiplyScalar(0.5)

					if (upOffset != 0) {
						center.add(cv2.set(up).multiplyScalar(upOffset))
					}

					node.position = center//.alloc()
				})

				withQuat(rot => withVec3((cv1, cv2) => {
					axis.normalize()
					var axism = new cc.Vec3(axis.z, axis.x, axis.y);
					var axis1 = cv1.set(axis).cross(axism)
					var axis2 = cv2.set(axis).cross(axis1)
					// cc.Quat.fromViewUp(rot, axis, axis1)
					cc.Quat.fromAxes(rot, axis, axis1, axis2)
					node.rotation = rot
				}))

				node.parent = this.graphicRoot
			})
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

		this.drawBatchId = (++SeekResult.drawBatchIdAcc)
		let drawBatchId = this.drawBatchId

		setTimeout(() => {
			var up = this.graph.up
			if (this.vectorPath.length >= 2) {
				var first = this.vectorPath[0]
				for (var i = 1; i < this.vectorPath.length; i++) {
					var next = this.vectorPath[i]
					this.setCylinder(i - 1, first, next, lineWidth, up, options, drawBatchId)
					first = next
				}
			}
		}, 1)
	}

	clearDebug() {
		this.drawBatchId = -1
		for (let node of this.graphNodes) {
			MyNodePool.put(node)
		}
		this.graphNodes.clear()
	}

}
