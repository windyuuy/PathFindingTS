
import * as cc from "cc"
import { Quat } from "cc"
import { PhysicsSystem, Vec3 } from "cc"
import { bool, int } from "../../Scan/CompatDef"
import { cname } from "../convenient"
import { LayerMask } from "../LayerMask"
import { withList, withVec3 } from "../ObjectPool"
import { CollisionSystemBase, QueryTriggerInteraction } from "./CollisionSystem"
// import * as CANNON from '@cocos/cannon'

const sharedVec3 = new Vec3()
const sharedQuat = new Quat()

@cname("CannonCollisionSystem")
export class CannonCollisionSystem extends CollisionSystemBase {
	protected cannonSharedKeeper?: CANNON.OverlapKeeper
	protected getCannonSharedKeeper() {
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
	protected cannonOldcontacts: CANNON.ContactEquation[] = []
	protected cannonFrictionPool: CANNON.FrictionEquation[] = []

	public CheckCannonBodies(colliders: cc.Collider[], cnWorld: CANNON.World, layerMask: number, queryTriggerInteraction: QueryTriggerInteraction = QueryTriggerInteraction.Ignore) {
		let queriesHitTriggers = this.needTrigger(queryTriggerInteraction)

		let ret = withList((
			testBodies: CANNON.Body[],
			testLs1: CANNON.Body[],
			testLs2: CANNON.Body[],
			passedBodies: CANNON.Body[],
			contactResult: CANNON.ContactEquation[],
			frictionResult: CANNON.FrictionEquation[],
			adds: number[],
			removals: number[],
		) => {
			for (let testCollider of colliders) {
				let sharedBody = (testCollider.shape as any)._sharedBody
				sharedBody.syncSceneToPhysics()
				let testBTbody = sharedBody.body as CANNON.Body
				testBTbody.collisionResponse = queriesHitTriggers;
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
					cnWorld.narrowphase.getContacts(testLs2, passedBodies, cnWorld, contactResult, this.cannonOldcontacts, frictionResult, this.cannonFrictionPool);
					if (queriesHitTriggers) {
						ret = contactResult.length > 0
					} else {
						// let adds: number[] = []
						// let removals: number[] = []
						cnWorld.bodyOverlapKeeper.getDiff(adds, removals);
						ret = adds.length > 0
					}
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

	public CheckCapsule(start: Vec3, end: Vec3, radius: number, layerMask: int = this.DefaultRaycastLayers, queryTriggerInteraction: QueryTriggerInteraction = QueryTriggerInteraction.Ignore): boolean {

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

			axisA.set(Vec3.FORWARD)
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

	}

	public CheckSphere(position: Vec3, radius: number, layerMask: int = this.DefaultRaycastLayers, queryTriggerInteraction: QueryTriggerInteraction = QueryTriggerInteraction.Ignore): boolean {

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
	}

	public CheckBox(center: Vec3, halfExtents: Vec3, orientation: Quat = Quat.IDENTITY, layerMask: int = this.DefaultRaycastLayers, queryTriggerInteraction: QueryTriggerInteraction = QueryTriggerInteraction.Ignore): bool {

		let physicsWorld = PhysicsSystem.instance.physicsWorld
		let cnWorld = (physicsWorld as any)._world as CANNON.World

		let testNode = this.getSharedNode("testBoxNode")
		testNode.active = true
		testNode.position = center
		testNode.rotation = orientation

		let testCollider = testNode.getOrAddComponent(cc.BoxCollider)
		testCollider.enabled = true
		testCollider.isTrigger = true
		testCollider.size = sharedVec3.set(halfExtents).multiplyScalar(2)

		let ret = withList((colliders: cc.Collider[]) => {
			colliders.push(testCollider)
			return this.CheckCannonBodies(colliders, cnWorld, layerMask, queryTriggerInteraction)
		})

		testNode.active = false
		return ret
	}
}
