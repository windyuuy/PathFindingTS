import { path, Vec3 } from "cc";
import { Heuristic } from "../../Editor/PathFinderOptions";
import { GridGraph } from "../Scan/GridGenerator";
import { AStarFinder } from "./AStarLib/astar";
import { SeekResult } from "./SeekResult";

type Vector3 = Vec3

export class GraphSeeker {
	graphFinder!: AStarFinder
	graph!: GridGraph

	Init(graph: GridGraph) {
		this.graph = graph

		var heuristic: string
		switch (graph.heuristic) {
			case Heuristic.Manhattan:
				heuristic = "Manhattan"
				break
			case Heuristic.DiagonalManhattan:
				heuristic = "DiagonalManhattan"
				break
			case Heuristic.Euclidean:
				heuristic = "Euclidean"
				break
			default:
				heuristic = "Manhattan"
				break
		}

		var graphFinder = new AStarFinder().loadFromGraph({
			grid: {
				nodes: graph.nodes,
				width: graph.width,
				height: graph.depth,
			},
			diagonalAllowed: true,
			heuristic: heuristic as any,
			includeStartNode: true,
			includeEndNode: true,
			weight: graph.heuristicScale,
		})

		this.graphFinder = graphFinder

		return this
	}

	public StartPath(start: Vector3, end: Vector3): SeekResult {

		var startNode = this.graph.GetNearestNode(start, end)
		var endNode = this.graph.GetNearestNode(end, start)

		if (startNode == null || endNode == null) {
			var result = new SeekResult()
			result.isOk = false
			result.vectorPath = []
			return result
		}

		var paths = this.graphFinder.findPath({
			x: startNode.ipos.x,
			y: startNode.ipos.y,
		}, {
			x: endNode.ipos.x,
			y: endNode.ipos.y,
		})

		var result = new SeekResult()
		result.isOk = true
		var grid = this.graphFinder.getGrid()
		for (var pn of paths) {
			// var index = pn[1] * this.graph.width + pn[0]
			// var index = this.graph.toIndex(pn[0], pn[1])
			// var node = this.graph.nodes[index]
			var node = grid.getNodeAt({ x: pn[0], y: pn[1] })
			result.nodes.push(node)
			result.vectorPathRaw.push(node.position.asVec3())
		}
		result.vectorPath = result.vectorPathRaw.slice()
		// 处理起点终点不在网格中心的细节
		if (result.vectorPath.length > 0) {
			if (!result.vectorPath[0].equals(start)) {
				result.vectorPath.unshift(start)
			}
			if (!result.vectorPath[result.vectorPath.length - 1].equals(end)) {
				result.vectorPath.push(end)
			}
		}

		return result

	}

}
