import { path, Vec3 } from "cc";
import { Heuristic } from "../../Editor/PathFinderOptions";
import { GridGraph } from "../Scan/GridGenerator";
import { NNConstraint } from "../Scan/NNInfo/astarclasses";
import { AStarFinder } from "./AStarLib/astar";
import { FindPathResult } from "./AStarLib/finders/astar-finder";
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
				refGraph: graph,
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

	static createSeekResult(start: Vector3, end: Vector3) {
		var result = new SeekResult()
		result.start.set(start)
		result.end.set(end)
		return result
	}

	public StartPath(result: SeekResult, start: Vector3, end: Vector3): SeekResult {
		// var result = this.createSeekResult(start, end)
		result.reset()
		result.graph = this.graph

		if (start.equals(end)) {
			result.ok = true
			result.vectorPath = [start.alloc()]
			return result
		}

		let walkableConstraint = new NNConstraint({
			constrainWalkability: true,
			walkable: true,
			preferWalkability: true,
			constrainArea: false,
			constrainDistance: false,
			constrainTags: false,
		})
		const GetNearestNode = (start: Vec3, end: Vec3) => {
			// 优先找最近可行走点
			let nearWalkable = this.graph.GetNearestNode(start, end, walkableConstraint)
			if (nearWalkable != null) {
				return nearWalkable
			}
			// 否则只找最近点
			return this.graph.GetNearestNode(start, end)
		}
		var startNode = GetNearestNode(start, end)
		var endNode = GetNearestNode(end, start)

		if (startNode == null || endNode == null) {
			result.ok = false
			result.vectorPath = []
			return result
		}

		this.graphFinder.findPath(
			result,
			{
				x: startNode.ipos.x,
				y: startNode.ipos.y,
			},
			{
				x: endNode.ipos.x,
				y: endNode.ipos.y,
			}
		)

		return result

	}

}
