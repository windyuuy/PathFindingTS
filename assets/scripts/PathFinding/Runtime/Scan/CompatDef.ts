import { Vec3 } from "cc";
import { GridNode } from "./GridNode";

export type Vector3 = Vec3;
export const Vector3 = Vec3;
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
