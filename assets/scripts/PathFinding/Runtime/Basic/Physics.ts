import { geometry, PhysicsRayResult, PhysicsSystem, Vec3 } from "cc";
import { BuiltinSharedBody } from "./BuiltinShapeBody";

export type RaycastHit = PhysicsRayResult

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

export class Physics {
	public static RaycastRaw(worldRay: geometry.Ray, mask?: number, maxDistance?: number, queryTrigger?: boolean): boolean {
		return PhysicsSystem.instance.raycastClosest(worldRay, mask, maxDistance, queryTrigger);
	}

	public static Raycast(origin: Vec3, direction: Vec3, outs: { hitInfo: RaycastHit }, maxDistance: number, layerMask: number, queryTriggerInteraction: QueryTriggerInteraction): boolean {
		var ray = new geometry.Ray();
		// geometry.Ray.fromPoints(ray, origin, direction);
		ray.o = origin
		ray.d = direction
		var ret = this.RaycastRaw(ray, layerMask, maxDistance, queryTriggerInteraction != QueryTriggerInteraction.Ignore)
		if (ret) {
			var result = PhysicsSystem.instance.raycastClosestResult
			outs.hitInfo = result
		}
		return ret
	}

	public static CheckCapsule(start: Vec3, end: Vec3, radius: number, layerMask: number, queryTriggerInteraction: QueryTriggerInteraction): boolean {
		// var bodies = (PhysicsSystem.instance.physicsWorld as any)["bodies"] as BuiltinSharedBody[]
		// const max_d = options.maxDistance;
		// const mask = options.mask;
		// for (let i = 0; i < this.bodies.length; i++) {
		// 	const body = this.bodies[i];
		// 	if (!(body.collisionFilterGroup & mask)) continue;
		// 	for (let i = 0; i < body.shapes.length; i++) {
		// 		const shape = body.shapes[i];
		// 		const distance = intersect.resolve(worldRay, shape.worldShape);
		// 		if (distance === 0 || distance > max_d) {
		// 			continue;
		// 		} else {
		// 			const r = pool.add();
		// 			worldRay.computeHit(hitPoint, distance);
		// 			r._assign(hitPoint, distance, shape.collider, Vec3.ZERO);
		// 			results.push(r);
		// 		}
		// 	}
		// }
		// return results.length > 0;
		return false;

	}

	public static CheckSphere(position: Vec3, radius: number, layerMask: number, queryTriggerInteraction: QueryTriggerInteraction): boolean {
		return true;
	}
}
