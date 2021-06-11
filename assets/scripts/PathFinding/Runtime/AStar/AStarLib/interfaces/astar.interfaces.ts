import { GridGraph } from "../../../Scan/GridGenerator";
import { ANode } from "../core/node";
import { Heuristic } from '../types/astar.types';

export interface IAStarFinderConstructorFromMatrix {
  grid: IGridConstructorFromMatrix;
  diagonalAllowed?: boolean;
  heuristic?: Heuristic;
  weight?: number;
  includeStartNode?: boolean;
  includeEndNode?: boolean;
}

export interface IGridConstructorFromMatrix {
  width?: number;
  height?: number;
  matrix?: number[][];
  densityOfObstacles?: number;
}

export interface IAStarFinderConstructorFromGraph {
  grid: IGridConstructorFromGraph;
  diagonalAllowed?: boolean;
  heuristic?: Heuristic;
  weight?: number;
  includeStartNode?: boolean;
  includeEndNode?: boolean;
  // TODO: 支持更多选项
  /**
   * 是否允许经过障碍物的对角线
   */
  diagnoalAlongCornerAllowed?: boolean
}

export interface IGridConstructorFromGraph {
  width: number;
  height: number;
  nodes: ANode[];
  densityOfObstacles?: number;
  refGraph: GridGraph
}

export interface INodeConstructor {
  id: number;
  ipos: IPoint;
  walkable?: boolean;
}

export interface IPoint {
  x: number;
  y: number;
}
