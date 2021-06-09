import { geometry, PhysicsRayResult, PhysicsSystem, Vec3 } from "cc";
import { bool, int, TSVector } from "../Scan/CompatDef";
import * as cc from "cc"
import { LayerMask } from "./LayerMask";

// import * as AmmoJs from '@cocos/ammo';
import * as CANNON from '@cocos/cannon'
import { withList, withVec3 } from "./ObjectPool";
import { Quat } from "cc";

export type RaycastHit = PhysicsRayResult
export const RaycastHit = PhysicsRayResult

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

const sharedRay = new geometry.Ray()
const sharedVec3 = new Vec3()
const sharedQuat = new Quat()

export class Physics {
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

	protected static foreachNode(root: cc.Node, call: (node: cc.Node) => void) {
		if (cc.isValid(root)) {
			call(root)
		}
		for (let child of root.children) {
			this.foreachNode(child, call)
		}
	}

	protected static getBulletBody(collider: cc.Collider): Ammo.btRigidBody {
		return (collider.shape as any)._sharedBody._bodyStruct.body as Ammo.btRigidBody
	}

	protected static cannonSharedKeeper: CANNON.OverlapKeeper
	protected static getCannonSharedKeeper() {
		if (this.cannonSharedKeeper == null) {
			let physicsWorld = PhysicsSystem.instance.physicsWorld
			let cnWorld = (physicsWorld as any)._world as CANNON.World
			let originKeeper = cnWorld.bodyOverlapKeeper
			this.cannonSharedKeeper = {
				current: [],
				previous: [],
			} as any as CANNON.OverlapKeeper
			Object.setPrototypeOf(this.cannonSharedKeeper, Object.getPrototypeOf(originKeeper))
		}
		return this.cannonSharedKeeper
	}
	protected static cannonOldcontacts: CANNON.ContactEquation[] = []
	protected static cannonFrictionPool: CANNON.FrictionEquation[] = []

	protected static CheckCannonBodies(colliders: cc.Collider[], cnWorld: CANNON.World, layerMask: number, queryTriggerInteraction: QueryTriggerInteraction = QueryTriggerInteraction.Ignore) {
		let ret = withList((
			testBodies: CANNON.Body[],
			testLs1: CANNON.Body[],
			testLs2: CANNON.Body[],
			passedBodies: CANNON.Body[],
			passedBodies2: CANNON.ContactEquation[],
			frictionResult: CANNON.FrictionEquation[],
			adds: number[],
			removals: number[],
		) => {
			for (let testCollider of colliders) {
				let sharedBody = (testCollider.shape as any)._sharedBody
				sharedBody.syncSceneToPhysics()
				let testBTbody = sharedBody.body as CANNON.Body
				testBTbody.collisionResponse = false;
				testBodies.push(testBTbody)
			}

			let allBodies = cnWorld.bodies.concat()
			allBodies = allBodies.filter(body => {
				let node = (body as any).__cc_wrapper__.node as cc.Node
				if (LayerMask.ContainsAnyLayer(node.layer, layerMask)) {
					return true
				}
				return false
			})
			for (let testBTbody of testBodies) {
				allBodies.remove(testBTbody)
			}

			// let testLs1: CANNON.Body[] = []
			// let passedBodies: CANNON.Body[] = []

			for (let testBTbody of testBodies) {
				for (let body of allBodies) {
					cnWorld.broadphase.intersectionTest(testBTbody, body, testLs1, passedBodies)
				}
			}
			if (passedBodies.length <= 0) {
				return false;
			}

			// 去重
			let bodyMap = Object.create(null)
			for (let testBTbody of passedBodies) {
				bodyMap[testBTbody.id] = testBTbody
			}
			passedBodies.length = 0
			for (let id in bodyMap) {
				passedBodies.push(bodyMap[id])
			}

			// 去重2
			bodyMap = Object.create(null)
			for (let testBTbody of testLs1) {
				bodyMap[testBTbody.id] = testBTbody
			}
			testLs1.length = 0
			for (let id in bodyMap) {
				testLs1.push(bodyMap[id])
			}

			// 检测碰撞
			// let passedBodies2: CANNON.ContactEquation[] = []
			// let frictionResult: CANNON.FrictionEquation[] = []
			let originKeeper = cnWorld.bodyOverlapKeeper
			let newKeeper = this.getCannonSharedKeeper()
			newKeeper.current.length = 0
			newKeeper.previous.length = 0

			cnWorld.bodyOverlapKeeper = newKeeper
			let ret = false
			try {
				for (let j = 0; j < testLs1.length; j++) {
					let testBTbody = testLs1[j]
					testLs2.clear()
					for (let i = 0; i < passedBodies.length; i++) {
						testLs2.push(testBTbody)
					}
					cnWorld.narrowphase.getContacts(testLs2, passedBodies, cnWorld, passedBodies2, this.cannonOldcontacts, frictionResult, this.cannonFrictionPool);
					// let adds: number[] = []
					// let removals: number[] = []
					cnWorld.bodyOverlapKeeper.getDiff(adds, removals);
					ret = adds.length > 0
					if (ret) {
						break
					}
				}
			} catch (e) {
				throw e
			} finally {
				cnWorld.bodyOverlapKeeper = originKeeper
			}
			return ret
		})
		return ret

	}

	protected static getSharedNodeRoot(): cc.Node {
		let rootNode = cc.find("")!
		let testNode = rootNode.getChildByName("__testCannon")
		if (testNode == null) {
			testNode = new cc.Node("__testCannon")
			testNode.parent = rootNode
		}
		return testNode
	}
	protected static getSharedNode(name: string): cc.Node {
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
		}

		return sharedNode

	}

	public static CheckCapsule(start: Vec3, end: Vec3, radius: number, layerMask: number, queryTriggerInteraction: QueryTriggerInteraction): boolean {

		const physicSelectorId = cc.physics.selector.id
		if (physicSelectorId == "cannon.js") {
			//#region cannon.js
			let physicsWorld = PhysicsSystem.instance.physicsWorld
			let cnWorld = (physicsWorld as any)._world as CANNON.World

			let testCapsuleNode = this.getSharedNode("testCapsuleNode")
			let testSphereNodeUp = this.getSharedNode("testSphereNodeUp")
			let testSphereNodeDown = this.getSharedNode("testSphereNodeDown")

			testCapsuleNode.active = true
			testSphereNodeUp.active = true
			testSphereNodeDown.active = true

			let testCollider = testCapsuleNode.getOrAddComponent(cc.CylinderCollider)
			testCollider.isTrigger = true
			let testSphereUp = testSphereNodeUp.getOrAddComponent(cc.SphereCollider)
			testSphereUp.isTrigger = true
			let testSphereDown = testSphereNodeDown.getOrAddComponent(cc.SphereCollider)
			testSphereDown.isTrigger = true

			withVec3((center, forwardUp, axisA, axisY, offsetUp, forwardUnit) => {
				center.set(start).add(end).multiplyScalar(0.5)
				testCapsuleNode.position = center

				forwardUp.set(end).subtract(start)
				if (forwardUp.equals(Vec3.ZERO)) {
					forwardUp.set(Vec3.UP)
				}
				// 默认朝向 z:-1
				axisA.set(0, 0, -1)
				Vec3.cross(axisY, axisA, forwardUp)
				// 求出目标朝向
				let forwardA = Vec3.cross(axisA, forwardUp, axisY)
				forwardA.normalize()
				testCapsuleNode.forward = forwardA

				testCollider.radius = radius
				// testCollider.size = new Vec3(radius * 2, radius * 2, radius * 2)
				// testCollider.height = forwardUp.length() + radius * 2
				testCollider.height = forwardUp.length()

				forwardUnit.set(forwardUp).normalize()
				testSphereUp.center = offsetUp.set(forwardUnit).multiplyScalar(testCollider.height / 2)
				testSphereUp.radius = radius
				testSphereDown.center = offsetUp.set(forwardUnit).multiplyScalar(-testCollider.height / 2)
				testSphereDown.radius = radius

			})

			let ret = withList((colliders: cc.Collider[]) => {
				colliders.push(testCollider)
				colliders.push(testSphereUp)
				colliders.push(testSphereDown)
				return this.CheckCannonBodies(colliders, cnWorld, layerMask, queryTriggerInteraction)
			})

			testCapsuleNode.active = false
			testSphereNodeUp.active = false
			testSphereNodeDown.active = false
			return ret

			//#endregion
		} else if (physicSelectorId == "builtin") {
			throw new Error("not implemented")

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
			// return false;

		} else if (physicSelectorId == "ammo.js") {
			throw new Error("not implemented")

			//#region ammo.js
			// class AAV implements AmmoJs.ContactResultCallback {
			// 	public addSingleResult(cp: AmmoJs.btManifoldPoint, colObj0Wrap: AmmoJs.btCollisionObjectWrapper, partId0: number, index0: number, colObj1Wrap: AmmoJs.btCollisionObjectWrapper, partId1: number, index1: number): number {
			// 		throw new Error("Method not implemented.");
			// 	}
			// }
			// let physicsWorld = PhysicsSystem.instance.physicsWorld
			// let btWorld = (physicsWorld as any)._btWorld as Ammo.btDiscreteDynamicsWorld
			// let detectOnly = false

			// let rootNode = cc.find("")!
			// let temp: cc.Collider[] = rootNode.getComponentsInChildren(cc.Collider)
			// let colliders: cc.Collider[] = []
			// for (let collider of temp) {
			// 	// if (LayerMask.ContainsLayers(collider.node.layer, layerMask)) 
			// 	{
			// 		colliders.push(collider)
			// 	}
			// }

			// let testNode = new cc.Node()
			// testNode.parent = rootNode
			// let testCollider = testNode.addComponent(cc.SphereCollider)
			// let testBTbody = (testCollider.shape as any)._sharedBody._bodyStruct.body as Ammo.btRigidBody

			// let contactList: cc.Collider[] = []
			// for (let collider of colliders) {
			// 	let btBody = this.getBulletBody(collider)
			// 	// let ret = testBTbody.checkCollideWith(btBody)
			// 	// let callback = new AmmoJs.ContactResultCallback()
			// 	// callback.addSingleResult = (fwl, wef) => {
			// 	// 	return 0
			// 	// }
			// 	btWorld.contactTest(btBody, new AAV())
			// 	// if (ret) {
			// 	// 	contactList.push(collider)
			// 	// 	if (detectOnly) {
			// 	// 		break
			// 	// 	}
			// 	// }
			// }

			// let ret = contactList.length > 0
			// return ret;
			//#endregion

		} else if (physicSelectorId == "physx") {
			throw new Error("not implemented")
		} else {
			throw new Error("not implemented")
		}

	}

	public static CheckSphere(position: Vec3, radius: number, layerMask: number, queryTriggerInteraction: QueryTriggerInteraction = QueryTriggerInteraction.Ignore): boolean {
		const physicSelectorId = cc.physics.selector.id
		if (physicSelectorId == "cannon.js") {
			//#region cannon.js
			let physicsWorld = PhysicsSystem.instance.physicsWorld
			let cnWorld = (physicsWorld as any)._world as CANNON.World

			let testNode = this.getSharedNode("testSphereNode")
			testNode.active = true
			testNode.position = position

			let testCollider = testNode.getOrAddComponent(cc.SphereCollider)
			testCollider.enabled = true
			testCollider.isTrigger = true
			testCollider.radius = radius

			let ret = withList((colliders: cc.Collider[]) => {
				colliders.push(testCollider)
				return this.CheckCannonBodies(colliders, cnWorld, layerMask, queryTriggerInteraction)
			})

			testNode.active = false
			return ret

			//#endregion
		} else {
			throw new Error("not implemented")
		}
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
