
import * as cc from "cc"
import { Vec3 } from "cc"
import { PhysicsSystem } from "cc"
import { bool } from "../../Scan/CompatDef"
import { cname } from "../convenient"
import { LayerMask } from "../LayerMask"
import { withList, withVec3 } from "../ObjectPool"

//
// 摘要:
//     Overrides the global Physics.queriesHitTriggers.
export enum QueryTriggerInteraction {
	//
	// 摘要:
	//     Queries use the global Physics.queriesHitTriggers setting.
	UseGlobal = 0,
	//
	// 摘要:
	//     Queries never report Trigger hits.
	Ignore = 1,
	//
	// 摘要:
	//     Queries always report Trigger hits.
	Collide = 2
}

export interface ICollisionSystem {

}

@cname("CollisionSystemBase")
export abstract class CollisionSystemBase implements ICollisionSystem {

	protected static foreachNode(root: cc.Node, call: (node: cc.Node) => void) {
		if (cc.isValid(root)) {
			call(root)
		}
		for (let child of root.children) {
			this.foreachNode(child, call)
		}
	}

	public queriesHitTriggers: bool = false;

	protected needTrigger(queryTriggerInteraction: QueryTriggerInteraction) {
		let queriesHitTriggers = this.queriesHitTriggers
		switch (queryTriggerInteraction) {
			case QueryTriggerInteraction.Collide:
				{
					queriesHitTriggers = true
					break;
				}
			case QueryTriggerInteraction.Ignore:
				{
					queriesHitTriggers = false
					break;
				}
			default: {
				break
			}
		}
		return queriesHitTriggers
	}

	public CheckCannonBodies(colliders: cc.Collider[], cnWorld: CANNON.World, layerMask: number, queryTriggerInteraction: QueryTriggerInteraction = QueryTriggerInteraction.Ignore): bool {
		return false
	}

	protected getSharedNodeRoot(): cc.Node {
		let rootNode = cc.find("")!
		let testNode = rootNode.getChildByName("__testCannon")
		if (testNode == null) {
			testNode = new cc.Node("__testCannon")
			testNode.parent = rootNode
		}
		return testNode
	}
	protected getSharedNode(name: string): cc.Node {
		let rootNode = cc.find("")!
		let testNode = rootNode.getChildByName("__testCannon")
		if (testNode == null) {
			testNode = new cc.Node("__testCannon")
			testNode.parent = rootNode
		}
		let sharedNode = testNode.getChildByName(name)!
		if (sharedNode == null) {
			sharedNode = new cc.Node()
			sharedNode.parent = testNode
			sharedNode.name = name
			sharedNode.layer = -1
		}

		return sharedNode

	}

	public CheckCapsule(start: Vec3, end: Vec3, radius: number, layerMask: number, queryTriggerInteraction: QueryTriggerInteraction): boolean {
		return false
	}

	public CheckSphere(position: Vec3, radius: number, layerMask: number, queryTriggerInteraction: QueryTriggerInteraction = QueryTriggerInteraction.Ignore): boolean {
		return false
	}
}
