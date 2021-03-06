import { geometry } from "cc";
import { PhysicsRayResult, Vec3 } from "cc"
import { ColliderType, Heuristic, NumNeighbours, PathFinderOptions } from "../../Editor/PathFinderOptions"
import { Float } from "../Basic/Float";
import { vec3Pool, withVec3 } from "../Basic/ObjectPool";
import { QueryTriggerInteraction } from "../Basic/Physics/CollisionSystem";
import { Physics } from "../Basic/Physics/Physics";
import { VectorMath } from "../Basic/VectorMath";
import { AstarPath } from "./AstarPath";
import { GraphTransform } from "./GraphTransform";
import { GridNode } from "./GridNode";
import { NNConstraint, NNInfoInternal } from "./NNInfo/astarclasses";
type Vector3 = Vec3;
const Vector3 = Vec3;

export enum RayDirection {
	Up,     /// <summary>< Casts the ray from the bottom upwards</summary>
	Down,   /// <summary>< Casts the ray from the top downwards</summary>
	Both    /// <summary>< Casts two rays in both directions</summary>
}

export class GraphCollision {
	width: number = 40
	depth: number = 40
	center: Vec3 = new Vec3()
	rotation: Vec3 = new Vec3()

	nodeSize: number = 1

	neighbours = NumNeighbours.Eight;

	maxClimb: number = 0.25
	maxSlope: number = 90

	// PhysicsOptions
	use2D: boolean = false

	collisionTesting: boolean = true

	colliderType: ColliderType = ColliderType.Capsule;

	mask: number = 0

	heightTesting: boolean = true

	rayLength: number = 100

	heightMask: number = 0

	colliderDiameter: number = 1
	colliderHeight: number = 0
	get height() {
		return this.colliderHeight
	}
	collisionOffset: number = 0

	thickRaycastDiameter: number = 1

	maxNearestNodeDistance: number = 100

	heuristic: Heuristic = Heuristic.Euclidean

	heuristicScale: number = 1


	up: Vec3 = Vec3.ZERO.alloc()
	upheight: Vec3 = Vec3.ZERO.alloc()
	finalRadius: number = 0
	finalRaycastRadius: number = 0

	get collisionCheck() {
		return this.collisionTesting
	}

	get heightCheck() {
		return this.heightTesting
	}

	get fromHeight() {
		return this.rayLength
	}

	thickRaycast: boolean = false

	unwalkableWhenNoGround: boolean = true

	public rayDirection: RayDirection = RayDirection.Both;

	/// <summary>
	/// Sets up several variables using the specified matrix and scale.
	/// See: GraphCollision.up
	/// See: GraphCollision.upheight
	/// See: GraphCollision.finalRadius
	/// See: GraphCollision.finalRaycastRadius
	/// </summary>
	public Initialize(options: PathFinderOptions, transform: GraphTransform, scale: number) {
		this.width = options.width
		this.depth = options.height
		this.center = options.center
		this.rotation = options.rotation
		this.nodeSize = options.nodeSize
		this.neighbours = options.neighbours
		this.maxClimb = options.maxClimb
		this.maxSlope = options.maxSlope
		this.use2D = options.use2D
		this.collisionTesting = options.collisionTesting
		this.colliderType = options.colliderType
		this.mask = options.mask
		this.heightTesting = options.heightTesting
		this.rayLength = options.rayLength
		this.heightMask = options.heightMask
		this.colliderDiameter = options.colliderDiameter
		this.colliderHeight = options.colliderHeight
		this.collisionOffset = options.collisionOffset
		this.thickRaycastDiameter = options.thickRaycastDiameter
		this.maxNearestNodeDistance = options.maxNearestNodeDistance
		this.heuristic = options.heuristic
		this.heuristicScale = options.heuristicScale
		this.thickRaycast = options.thickRaycast
		this.unwalkableWhenNoGround = options.unwalkableWhenNoGround


		withVec3((_up, _down) => {
			transform.Transform(_up, Vector3.UP);
			transform.Transform(_down, Vector3.ZERO);
			this.up.set(_up.subtract(_down).normalize())
			this.upheight.set(_up.multiplyScalar(this.colliderHeight))
			this.finalRadius = options.colliderDiameter * scale * 0.5;
			this.finalRaycastRadius = options.thickRaycastDiameter * scale * 0.5;
		})
	}

	/// <summary>
	/// Returns if the position is obstructed.
	/// If <see cref="collisionCheck"/> is false, this will always return true.\n
	/// </summary>
	public Check(_position: Vec3): boolean {
		return withVec3(position => {
			position.set(_position)

			if (!this.collisionCheck) {
				return true;
			}

			if (this.use2D) {
				switch (this.colliderType) {
					case ColliderType.Capsule:
					case ColliderType.Sphere:
						// return Physics2D.OverlapCircle(position, finalRadius, mask) == null;
						throw new Error("not implement");
					default:
						// return Physics2D.OverlapPoint(position, mask) == null;
						throw new Error("not implement");
				}
			}

			withVec3(cv1 => {
				position.add(cv1.set(this.up).multiplyScalar(this.collisionOffset))
			})
			switch (this.colliderType) {
				case ColliderType.Capsule:
					var ret1 = withVec3(cv1 => !Physics.CheckCapsule(position, cv1.set(position).add(this.upheight), this.finalRadius, this.mask, QueryTriggerInteraction.Ignore));
					return ret1;
				case ColliderType.Sphere:
					return !Physics.CheckSphere(position, this.finalRadius, this.mask, QueryTriggerInteraction.Ignore);
				default:
					return withVec3((cv1, cv2) => {
						switch (this.rayDirection) {
							case RayDirection.Both:
								return !Physics.Raycast(position, this.up, this.height, undefined, this.mask, QueryTriggerInteraction.Ignore) && !Physics.Raycast(position.alloc().add(this.upheight), cv1.set(this.up).negative(), this.height, undefined, this.mask, QueryTriggerInteraction.Ignore);
							case RayDirection.Up:
								return !Physics.Raycast(position, this.up, this.height, undefined, this.mask, QueryTriggerInteraction.Ignore);
							default:
								return !Physics.Raycast(cv1.set(position).add(this.upheight), cv2.set(this.up).negative(), this.height, undefined, this.mask, QueryTriggerInteraction.Ignore);
						}
					})
			}
		})
	}

	public CheckHeight(position: Vec3, out: { hitInfo: PhysicsRayResult, walkable: boolean }): Vec3 {
		out.walkable = true;

		if (!this.heightCheck || this.use2D) {
			return position;
		}

		if (this.thickRaycast) {
			withVec3((cv1, cv2, cv3, cv4) => {
				var ray = new geometry.Ray();
				ray.o.set(cv1.set(position).add(cv2.set(this.up).multiplyScalar(this.fromHeight)))
				ray.d.set(cv3.set(this.up).negative())
				if (Physics.SphereCast(ray, this.finalRaycastRadius, this.fromHeight + 0.005, out.hitInfo, this.heightMask, QueryTriggerInteraction.Ignore)) {
					return VectorMath.ClosestPointOnLine(ray.o, cv4.set(ray.o).add(ray.d), out.hitInfo.hitPoint);
				}

				out.walkable &&= !this.unwalkableWhenNoGround;
			})
		} else {
			// Cast a ray from above downwards to try to find the ground

			let ret2 = withVec3((cv1, up) => {
				var origin = cv1.set(position).add(up.set(this.up).multiplyScalar(this.fromHeight))
				up.set(this.up).negative()
				let ret2 = Physics.Raycast(origin, up, this.fromHeight + 0.005, out.hitInfo, this.heightMask, QueryTriggerInteraction.Ignore);
				return ret2;
			})
			if (ret2) {
				return out.hitInfo.hitPoint;
			}

			out.walkable &&= !this.unwalkableWhenNoGround;
		}
		return position;
	}


}
