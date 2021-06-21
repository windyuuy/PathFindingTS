import { Vec3 } from "cc";
import { Heuristic } from "../../Editor/PathFinderOptions";
import { MyProfiler } from "../Basic/Profiler";
import { AstarPath } from "../Scan/AstarPath";
import { GridGraph } from "../Scan/GridGenerator";
import { AStarFinder } from "./AStarLib/astar";
import { GraphSeeker } from "./GraphSeeker";
import { SeekResult } from "./SeekResult";

type Vector3 = Vec3
export type OnPathDelegate = (path: SeekResult) => void

export class AStarSeeker {
	graphSeekers: GraphSeeker[] = []

	/**
	 * 更新A*寻路器网格数据
	 * @param graphs 
	 */
	UpdateGraph(graphs: GridGraph[]) {
		this.graphSeekers.length = 0

		for (var graph of graphs) {
			var graphSeeker = new GraphSeeker().Init(graph)
			this.graphSeekers.push(graphSeeker)
		}
	}

	public StartPath(start: Vector3, end: Vector3, call?: OnPathDelegate): SeekResult {
		MyProfiler.BeginSample("StartPath")
		let ret = this._StartPath(start, end, call)
		MyProfiler.EndSample()
		if (AstarPath.active.enablePerformaceLog) {
			MyProfiler.TypeCurCost()
		}
		return ret
	}
	protected _StartPath(start: Vector3, end: Vector3, call?: OnPathDelegate): SeekResult {
		let result = GraphSeeker.createSeekResult(start, end)
		for (var seek of this.graphSeekers) {
			seek.StartPath(result, start, end)
			if (result.ok) {
				// var vec1 = new Vec3().set(end).subtract(start).normalize();
				// var vec2 = new Vec3().set(result.vectorPath[1]).subtract(start).normalize();
				// var th = vec1.dot(vec2);
				// console.log(start, end, vec1, vec2, result.vectorPath[0], result.vectorPath[1], th);
				if (call != null) {
					call(result)
				}
				return result
			}
		}

		return result
	}
}
