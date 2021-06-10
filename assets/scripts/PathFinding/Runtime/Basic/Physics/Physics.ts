import { geometry, PhysicsRayResult, PhysicsSystem, Vec3 } from "cc";
import { bool, int, TSVector } from "../../Scan/CompatDef";
import * as cc from "cc"
import { LayerMask } from "../LayerMask";
import { withList, withVec3 } from "../ObjectPool";
import { Quat } from "cc";
import { CollisionSystemBase, QueryTriggerInteraction } from "./CollisionSystem";
import { CannonCollisionSystem } from "./CannonCollisoinSystem";
import { IS_CC_EDITOR } from "../Macro";

export type RaycastHit = PhysicsRayResult
export const RaycastHit = PhysicsRayResult

const sharedRay = new geometry.Ray()
const sharedVec3 = new Vec3()
const sharedQuat = new Quat()

export class Physics {


	public static get DefaultRaycastLayers() {
		return this.collisionSystem.DefaultRaycastLayers
	}

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

	protected static RaycastRaw(worldRay: geometry.Ray, mask?: number, maxDistance?: number, queryTrigger?: boolean): boolean {
		return PhysicsSystem.instance.raycastClosest(worldRay, mask, maxDistance, queryTrigger);
	}

	public static Raycast(origin: Vec3, direction: Vec3, maxDistance: number, outHitInfo?: RaycastHit, layerMask: number = this.DefaultRaycastLayers, queryTriggerInteraction: QueryTriggerInteraction = QueryTriggerInteraction.Ignore): boolean {
		var ray = sharedRay
		ray.o.set(origin)
		ray.d.set(direction)
		var ret = this.RaycastRaw(ray, layerMask, maxDistance, queryTriggerInteraction != QueryTriggerInteraction.Ignore)
		if (ret) {
			var result = PhysicsSystem.instance.raycastClosestResult
			if (outHitInfo) {
				outHitInfo._assign(result.hitPoint, result.distance, result.collider, result.hitNormal)
			}
		}
		return ret
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

	public static get queriesHitTriggers(): bool {
		return this.collisionSystem.queriesHitTriggers
	}
	public static set queriesHitTriggers(value: bool) {
		this.collisionSystem.queriesHitTriggers = value
	}

	public static CheckCapsule(start: Vec3, end: Vec3, radius: number, layerMask: int = this.DefaultRaycastLayers, queryTriggerInteraction: QueryTriggerInteraction = QueryTriggerInteraction.Ignore): boolean {
		return this.collisionSystem.CheckCapsule(start, end, radius, layerMask, queryTriggerInteraction)
	}

	public static CheckSphere(position: Vec3, radius: number, layerMask: int = this.DefaultRaycastLayers, queryTriggerInteraction: QueryTriggerInteraction = QueryTriggerInteraction.Ignore): boolean {
		return this.collisionSystem.CheckSphere(position, radius, layerMask, queryTriggerInteraction)
	}

	public static CheckBox(center: Vec3, halfExtents: Vec3, orientation: Quat = Quat.IDENTITY, layerMask: int = this.DefaultRaycastLayers, queryTriggerInteraction: QueryTriggerInteraction = QueryTriggerInteraction.Ignore): bool {
		return this.collisionSystem.CheckBox(center, halfExtents, orientation, layerMask, queryTriggerInteraction)
	}

	static SphereCast(ray: geometry.Ray, radius: number, maxDistance: number, hitInfo?: PhysicsRayResult, heightMask: number = this.DefaultRaycastLayers, Ignore: QueryTriggerInteraction = QueryTriggerInteraction.Ignore): bool {
		throw new Error("Method not implemented.");
	}
}

if (!IS_CC_EDITOR) {
	Physics["init"]()
}
