
import { _decorator, Component, Node, Vec3, Quat, Enum, BitMask, PhysicsSystem, physics } from 'cc';
import { IS_CC_EDITOR } from "../Runtime/Basic/Macro";
import { EditorUtils } from "./EditorUtils";
import { PathFinderDebugDrawOptions } from "./PathFinderDebugDrawOptions";
const { ccclass, property } = _decorator;
import "../Runtime/Basic/PhysicsLayerMask"
import { PhysicsLayerMask } from "../Runtime/Basic/PhysicsLayerMask";

/// <summary>Number of threads to use</summary>
export enum ThreadCount {
	AutomaticLowLoad = 2 ** 10 - 1,
	AutomaticHighLoad = 2 ** 10 - 2,
	None = 0,
	One = 1,
	Two,
	Three,
	Four,
	Five,
	Six,
	Seven,
	Eight
}

/**
 * 图类型
 */
export enum InspectorGridMode {
	Grid = 0,
	IsometricGrid = 1,
	Hexagonal = 2,
	Advanced = 3,
}

/**
 * 连通类型
 */
export enum NumNeighbours {
	/**
	 * 四向
	 */
	Four = 0,
	/**
	 * 八向
	 */
	Eight = 1,
	/**
	 * 六向
	 */
	Six = 2,
}

/**
 * 连通类型
 */
enum _NumNeighbours {
	/**
	 * 四向
	 */
	四向 = 0,
	/**
	 * 八向
	 */
	八向 = 1,
}

export enum ColliderType {
	/**
	 * 胶囊体
	 */
	Capsule = 0,
	Sphere = 1,
}

export enum Heuristic {
	/// <summary>Manhattan distance. See: https://en.wikipedia.org/wiki/Taxicab_geometry</summary>
	Manhattan,
	/// <summary>
	/// Manhattan distance, but allowing diagonal movement as well.
	/// Note: This option is currently hard coded for the XZ plane. It will be equivalent to Manhattan distance if you try to use it in the XY plane (i.e for a 2D game).
	/// </summary>
	DiagonalManhattan,
	/// <summary>Ordinary distance. See: https://en.wikipedia.org/wiki/Euclidean_distance</summary>
	Euclidean,
	/// <summary>
	/// Use no heuristic at all.
	/// This reduces the pathfinding algorithm to Dijkstra's algorithm.
	/// This is usually significantly slower compared to using a heuristic, which is why the A* algorithm is usually preferred over Dijkstra's algorithm.
	/// You may have to use this if you have a very non-standard graph. For example a world with a <a href="https://en.wikipedia.org/wiki/Wraparound_(video_games)">wraparound playfield</a> (think Civilization or Asteroids) and you have custom links
	/// with a zero cost from one end of the map to the other end. Usually the A* algorithm wouldn't find the wraparound links because it wouldn't think to look in that direction.
	/// See: https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
	/// </summary>
	None
}

PhysicsLayerMask.addLayer("Obstacle", 2)

@ccclass('PathFinderOptions')
export class PathFinderOptions {
	@property({
		displayName: "图类型",
		type: Enum(InspectorGridMode),
	})
	inspectorGridMode: InspectorGridMode = InspectorGridMode.Grid

	@property({
		displayName: "网格宽度",
	})
	width: number = 40
	@property({
		displayName: "网格高度",
	})
	height: number = 40

	@property({
		displayName: "节点尺寸",
	})
	nodeSize: number = 1

	@property({
		displayName: "中心偏移"
	})
	center: Vec3 = new Vec3()
	@property({
		displayName: "旋转角度"
	})
	rotation: Vec3 = new Vec3()

	@property({
		type: Enum(_NumNeighbours),
		displayName: "网格连通类型",
		visible: true,
	})
	protected _neighbours = _NumNeighbours.八向;

	public get neighbours(): NumNeighbours {
		if (this._neighbours == _NumNeighbours.八向) {
			return NumNeighbours.Eight
		} else if (this._neighbours == _NumNeighbours.四向) {
			return NumNeighbours.Four
		} else {
			throw new Error("not implement")
		}
	}

	@property({
		tooltip: "cutCorners",
	})
	cutCorners: boolean = true

	@property({
		displayName: "最大爬升高度"
	})
	maxClimb: number = 0.25

	@property({
		displayName: "最大爬升角度",
		range: [0, 90, 0.1],
		slide: true,
	})
	maxSlope: number = 90

	// PhysicsOptions
	@property({
		visible: false,
	})
	use2D: boolean = false

	@property({
		displayName: "启用碰撞测试"
	})
	collisionTesting: boolean = true

	@property({
		type: Enum(ColliderType),
		displayName: "碰撞体类型",
	})
	colliderType: ColliderType = ColliderType.Capsule;

	@property({
		displayName: "直径",
	})
	colliderDiameter: number = 0.1

	@property({
		displayName: "碰撞体高度/长度",
	})
	colliderHeight: number = 0

	@property({
		displayName: "位置偏移",
	})
	collisionOffset: number = 0

	@property({
		type: BitMask(physics.PhysicsLayers.BitMask),
		tooltip: "碰撞测试",
		displayName: "障碍物层级",
	})
	mask: number = 0

	@property({
		displayName: "启用高度测试"
	})
	heightTesting: boolean = true

	@property({
		displayName: "射线长度"
	})
	rayLength: number = 100

	@property({
		type: BitMask(physics.PhysicsLayers.BitMask),
		tooltip: "高度测试",
		displayName: "障碍物层级",
	})
	heightMask: number = 1

	@property({
		displayName: "使用粗射线检测",
		// TODO: 支持swipe检测
		visible: false,
	})
	thickRaycast: boolean = false

	@property({
		displayName: "粗射线检测直径",
		visible: false,
	})
	thickRaycastDiameter: number = 1

	@property({
		displayName: "没有平台时不可行走",
	})
	unwalkableWhenNoGround: boolean = true

	@property({
		visible: false,
		displayName: "线程数",
		type: Enum(ThreadCount),
	})
	threadCount: ThreadCount = ThreadCount.One

	@property
	maxNearestNodeDistance: number = 100

	@property({
		type: Enum(Heuristic),
	})
	heuristic: Heuristic = Heuristic.Euclidean

	@property({
		displayName: "权重",
	})
	heuristicScale: number = 1

	@property({
		visible: true,
	})
	penaltyAngle: boolean = false

	@property({
		visible: true,
	})
	penaltyAngleFactor: number = 100
	@property({
		slide: true,
		range: [0.1, 10, 0.01]
	})
	penaltyAnglePower: number = 1

	@property({
		visible: true,
	})
	penaltyPosition: boolean = false

	@property({
		visible: true,
	})
	penaltyPositionFactor: number = 0
	@property({
		visible: true,
	})
	penaltyPositionOffset: number = 1

	@property({
		visible: true,
	})
	initialPenalty: number = 0

	@property({
		displayName: "异步休憩间隔",
	})
	asyncInterval: number = 0;

	@property({
		displayName: "调试绘图选项",
	})
	debugDrawOptions: PathFinderDebugDrawOptions = new PathFinderDebugDrawOptions()

	public static start(options: PathFinderOptions[]) {
		PhysicsLayerMask.UpdateAttrLayer(PathFinderOptions, "mask", "bitmask");
		this.updateOptionsView(options)
	}

	public static update(options: PathFinderOptions[]) {
		this.updateOptionsView(options)
	}

	public static lateUpdate(options: PathFinderOptions[]) {
	}

	protected static updateOptionsView(options: PathFinderOptions[]) {
		if (IS_CC_EDITOR) {
			for (let option of options) {
				let penaltyAngle = option.penaltyAngle;
				EditorUtils.setAttrVisible(option, "penaltyAngleFactor", penaltyAngle);
				EditorUtils.setAttrVisible(option, "penaltyAnglePower", penaltyAngle);

				let penaltyPosition = option.penaltyPosition;
				EditorUtils.setAttrVisible(option, "penaltyPositionFactor", penaltyPosition);
				EditorUtils.setAttrVisible(option, "penaltyPositionOffset", penaltyPosition);
			}
		}
	}
}
