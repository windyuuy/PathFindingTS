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
		MyProfiler.TypeCurCost()
		return ret
	}
	protected _StartPath(start: Vector3, end: Vector3, call?: OnPathDelegate): SeekResult {
		for (var seek of this.graphSeekers) {
			result = seek.StartPath(start, end)
			if (result.isOk) {
				if (call != null) {
					call(result)
				}
				return result
			}
		}

		var result: SeekResult = new SeekResult()
		return result
	}
}
