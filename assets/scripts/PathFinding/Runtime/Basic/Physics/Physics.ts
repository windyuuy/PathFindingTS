import { geometry, PhysicsRayResult, PhysicsSystem, Vec3 } from "cc";
import { bool, int, TSVector } from "../../Scan/CompatDef";
import * as cc from "cc"
import { LayerMask } from "../LayerMask";
import { withList, withVec3 } from "../ObjectPool";
import { Quat } from "cc";
import { CollisionSystemBase, QueryTriggerInteraction } from "./CollisionSystem";
import { CannonCollisionSystem } from "./CannonCollisoinSystem";

export type RaycastHit = PhysicsRayResult
export const RaycastHit = PhysicsRayResult

const sharedRay = new geometry.Ray()
const sharedVec3 = new Vec3()
const sharedQuat = new Quat()

export class Physics {

	protected static collisionSystem: CollisionSystemBase
	protected static init() {
		const physicSelectorId = cc.physics.selector.id
		if (physicSelectorId == "cannon.js") {
			this.collisionSystem = new CannonCollisionSystem()
		} else if (physicSelectorId == "builtin") {
			throw new Error("not implemented")

		} else if (physicSelectorId == "ammo.js") {
			throw new Error("not implemented")

		} else if (physicSelectorId == "physx") {
			throw new Error("not implemented")
		} else {
			throw new Error("not implemented")
		}
	}

	public static RaycastRaw(worldRay: geometry.Ray, mask?: number, maxDistance?: number, queryTrigger?: boolean): boolean {
		return PhysicsSystem.instance.raycastClosest(worldRay, mask, maxDistance, queryTrigger);
	}

	public static Raycast(origin: Vec3, direction: Vec3, outs: { hitInfo: RaycastHit }, maxDistance: number, layerMask: number, queryTriggerInteraction: QueryTriggerInteraction): boolean {
		var ray = sharedRay
		// geometry.Ray.fromPoints(ray, origin, direction);
		ray.o.set(origin)
		ray.d.set(direction)
		var ret = this.RaycastRaw(ray, layerMask, maxDistance, queryTriggerInteraction != QueryTriggerInteraction.Ignore)
		if (ret) {
			var result = PhysicsSystem.instance.raycastClosestResult
			outs.hitInfo = result
		}
		return ret
	}

	public static get queriesHitTriggers(): bool {
		return this.collisionSystem.queriesHitTriggers
	}
	public static set queriesHitTriggers(value: bool) {
		this.collisionSystem.queriesHitTriggers = value
	}

	public static CheckCapsule(start: Vec3, end: Vec3, radius: number, layerMask: number, queryTriggerInteraction: QueryTriggerInteraction): boolean {
		return this.collisionSystem.CheckCapsule(start, end, radius, layerMask, queryTriggerInteraction)
	}

	public static CheckSphere(position: Vec3, radius: number, layerMask: number, queryTriggerInteraction: QueryTriggerInteraction = QueryTriggerInteraction.Ignore): boolean {
		return this.collisionSystem.CheckSphere(position, radius, layerMask, queryTriggerInteraction)
	}

	public static Linecast(start: TSVector, end: TSVector, layerMask: int): bool {
		var direction = sharedVec3.set(end).subtract(start)
		var maxDistance = direction.length()
		direction.normalize()

		var ray = sharedRay
		ray.o.set(start)
		ray.d.set(direction)
		var ret = this.RaycastRaw(ray, layerMask, maxDistance, false)
		return ret
	}
}

Physics["init"]()
