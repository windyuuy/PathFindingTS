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
}

export interface IGridConstructorFromGraph {
  width: number;
  height: number;
  nodes: ANode[];
  densityOfObstacles?: number;
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
