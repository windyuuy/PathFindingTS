import { BuiltinObject } from "./BuiltinObject";

type BuiltinShape = any

/**
 * Built-in static collider, no physical forces involved
 */
export interface BuiltinSharedBody extends BuiltinObject {

	readonly id: number

	readonly node: Node;
	readonly shapes: BuiltinShape[];

}
