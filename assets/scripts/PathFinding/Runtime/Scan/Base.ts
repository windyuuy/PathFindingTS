import { PhysicsRayResult, Vec3 } from "cc"
import { ColliderType, Heuristic, NumNeighbours, PathFinderOptions } from "../../Editor/PathFinderOptions"
import { Physics, QueryTriggerInteraction } from "../Basic/Physics";
import { GraphTransform } from "./GraphTransform";
type Vector3 = Vec3;
const Vector3 = Vec3;

export class GraphCollision {
	width: number = 40
	height: number = 40
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

	obstacleLayerMask: number = 0

	heightTesting: boolean = true

	rayLength: number = 100

	mask: number = 0

	diameter: number = 0.1

	thickRaycastDiameter: number = 1

	maxNearestNodeDistance: number = 100

	heuristic: Heuristic = Heuristic.Euclidean

	heuristicScale: number = 1


	up: Vec3 = Vec3.ZERO
	upheight: Vec3 = Vec3.ZERO
	finalRadius: number = 0
	finalRaycastRadius: number = 0

	get collisionCheck() {
		return this.collisionTesting
	}

	get heightCheck() {
		return this.heightTesting
	}

	get collisionOffset() {
		return this.center.length()
	}
	get fromHeight() {
		return this.rayLength
	}
	get heightMask() {
		return this.obstacleLayerMask
	}

	thickRaycast: boolean = false

	unwalkableWhenNoGround: boolean = true

	/// <summary>
	/// Sets up several variables using the specified matrix and scale.
	/// See: GraphCollision.up
	/// See: GraphCollision.upheight
	/// See: GraphCollision.finalRadius
	/// See: GraphCollision.finalRaycastRadius
	/// </summary>
	public Initialize(options: PathFinderOptions, transform: GraphTransform, scale: number) {
		this.width = options.width
		this.height = options.height
		this.center = options.center
		this.rotation = options.rotation
		this.nodeSize = options.nodeSize
		this.neighbours = options.neighbours
		this.maxClimb = options.maxClimb
		this.maxSlope = options.maxSlope
		this.use2D = options.use2D
		this.collisionTesting = options.collisionTesting
		this.colliderType = options.colliderType
		this.obstacleLayerMask = options.obstacleLayerMask
		this.heightTesting = options.heightTesting
		this.rayLength = options.rayLength
		this.mask = options.mask
		this.diameter = options.diameter
		this.thickRaycastDiameter = options.thickRaycastDiameter
		this.maxNearestNodeDistance = options.maxNearestNodeDistance
		this.heuristic = options.heuristic
		this.heuristicScale = options.heuristicScale


		var _up = transform.Transform(Vector3.UP);
		var _down = transform.Transform(Vector3.ZERO);
		this.up = _up.clone().subtract(_down).normalize()
		this.upheight = this.up.multiplyScalar(this.height)
		this.finalRadius = options.diameter * scale * 0.5;
		this.finalRaycastRadius = options.thickRaycastDiameter * scale * 0.5;
	}

	/// <summary>
	/// Returns if the position is obstructed.
	/// If <see cref="collisionCheck"/> is false, this will always return true.\n
	/// </summary>
	public Check(position: Vec3): boolean {
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

		position.add(this.up.clone().multiplyScalar(this.collisionOffset))
		switch (this.colliderType) {
			case ColliderType.Capsule:
				var ret1 = !Physics.CheckCapsule(position, position.clone().add(this.upheight), this.finalRadius, this.mask, QueryTriggerInteraction.Ignore);
				return ret1;
			case ColliderType.Sphere:
				return !Physics.CheckSphere(position, this.finalRadius, this.mask, QueryTriggerInteraction.Ignore);
			default:
				// switch (this.rayDirection) {
				// 	case RayDirection.Both:
				// 		return !Physics.Raycast(position, this.up, this.height, this.mask, QueryTriggerInteraction.Ignore) && !Physics.Raycast(position.clone().add(this.upheight), -this.up, this.height, this.mask, QueryTriggerInteraction.Ignore);
				// 	case RayDirection.Up:
				// 		return !Physics.Raycast(position, up, height, mask, QueryTriggerInteraction.Ignore);
				// 	default:
				// 		return !Physics.Raycast(position + upheight, -up, height, mask, QueryTriggerInteraction.Ignore);
				// }
				throw new Error("not implement")
		}
	}

	public CheckHeight(position: Vec3, out: { hitInfo: PhysicsRayResult, walkable: boolean }): Vec3 {
		out.walkable = true;

		if (!this.heightCheck || this.use2D) {
			return position;
		}

		if (this.thickRaycast) {
			// var ray = new Ray(position + up * fromHeight, -up);
			// if (Physics.SphereCast(ray, finalRaycastRadius, out hit, fromHeight + 0.005F, heightMask, QueryTriggerInteraction.Ignore)) {
			// 	return VectorMath.ClosestPointOnLine(ray.origin, ray.origin + ray.direction, hit.point);
			// }

			// walkable &= !unwalkableWhenNoGround;
			throw new Error("not implement")
		} else {
			// Cast a ray from above downwards to try to find the ground

			var ret2 = Physics.Raycast(position.add(this.up.clone().multiplyScalar(this.fromHeight)), this.up.negative(), out, this.fromHeight + 0.005, this.heightMask, QueryTriggerInteraction.Ignore);
			if (ret2) {
				return out.hitInfo.hitPoint;
			}

			out.walkable &&= !this.unwalkableWhenNoGround;
		}
		return position;
	}


}
