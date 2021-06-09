
import * as cc from "cc"
import { Float } from "../Basic/Float";
import { Physics } from "../Basic/Physics/Physics";
import { GridGraph } from "./GridGenerator";
import { GridNode } from "./GridNode";

// export type Vector3 = cc.Vec3;
// export const Vector3 = cc.Vec3;
export type GraphNode = GridNode
export type int = number
export type long = number
export type float = number
export type uint = number
export type bool = boolean
export type byte = number
export type List<T> = Array<T>
export const List = Array
export type Action<T = void> = (p: T) => void
export type Queue<T> = Array<T>
export const Queue = Array
export type Stack<T> = Array<T>
export const Stack = Array
export type ulong = number
export type FP = float


export type TPlayerId = string;
export type Vector2 = cc.Vec2;
export const Vector2 = cc.Vec2;
export const Mathf = Float;
export type TSFloat = float;

export type TSVector = cc.Vec3
export const TSVector = cc.Vec3

export type TSPhysics = Physics
export const TSPhysics = Physics

export type TSTransform = cc.Node
export const TSTransform = cc.Node

export type NavGraph = GridGraph
