declare namespace gcc.uit {
}
declare namespace gcc.box2d.tools {
    import b2data = fsync.box2d.b2data;
    /**
     * box2d预制体导出工具
     */
    class Box2DExport {
        static inst: Box2DExport;
        writeFile(fileName: string, ss: string): void;
        /**
         *
         * @param dir
         * @param outDir
         * @param call
         * @param throwAnyError 抛出任何异常,并打断当前导出流程
         */
        exportPrefabs(dir: string, outDir: string, call?: (err: any) => void, throwAnyError?: boolean): void;
        /**
         * 转换预制体
         * @param prefab
         * @param outDir
         */
        handleBox2dPrefab(prefab: cc.Prefab, outDir: string): void;
        tryRun(tip: string, call: Function, reThrow?: boolean): any;
        convBox2dPrefab(prefab: cc.Prefab): b2data.Box2DNode;
        /**
         * 检测重名子节点，保证简化版uid一致
         */
        detectDuplicatedChildName(node: cc.Node): void;
        /**
         * 转换节点
         * @param name
         * @param node
         */
        convBox2dNode(name: string, node: cc.Node): b2data.Box2DNode;
        getBodyNodeUID(node: cc.Node): string;
        getCompUID(comp: cc.Component): string;
        getNodeUID(node: cc.Node): string;
        /**
         * 转换含有rigidbody的子节点
         * @param node
         */
        handleBox2dBody(node: cc.Node): b2data.Box2DBody;
        /**
         * 转换碰撞分组信息
         * @param node
         */
        handleCollisionGroup(node: cc.Node): b2data.CollisionGroup;
        /**
         * 转换技能组件
         * @param comp
         */
        handleSkillComp(comp: CCB2SkillComp): any;
        /**
         * 转换box2d组件
         * @param comp
         */
        handleBox2dComponent(comp: cc.Component): any;
        handlers: {
            [key: string]: Function;
        };
        /**
         * 注册box2d组件转换函数
         */
        registerHandler(): void;
        handlePrismaticJoint(comp: cc.PrismaticJoint): b2data.PrismaticJoint;
        handleWheelJoint(comp: cc.WheelJoint): b2data.WheelJoint;
        handleWeldJoint(comp: cc.WeldJoint): b2data.WeldJoint;
        handleRigidBody(comp: cc.RigidBody): b2data.RigidBody;
        copyPhysicsColliderAttrs(dataComp: b2data.PhysicsCollider, comp: cc.PhysicsCollider): b2data.PhysicsCollider;
        copyJointAttrs(dataComp: b2data.Joint, comp: cc.Joint): b2data.Joint;
        handlePhysicsCircleCollider(comp: cc.PhysicsCircleCollider): b2data.PhysicsCircleCollider;
        handlePhysicsBoxCollider(comp: cc.PhysicsBoxCollider): b2data.PhysicsBoxCollider;
        handlePhysicsPolygonCollider(comp: cc.PhysicsPolygonCollider): b2data.PhysicsPolygonCollider;
        handleRevoluteJoint(comp: cc.RevoluteJoint): b2data.RevoluteJoint;
    }
}
declare namespace gcc.box2d.tools {
    /**
     * 碰撞组件基类
     * - 包括设置分组信息
     */
    class CCB2CollisionComp extends cc.Component {
        toJson(): {
            oid: string;
            groupIndex: string;
            categoryBits: string;
            maskBits: string;
        };
    }
}
declare namespace gcc.box2d.tools {
    /**
     * 技能组件基类
     */
    class CCB2SkillComp extends cc.Component {
        mynote: string;
        toJson(): {
            oid: string;
            skillType: string;
        };
        getSelfRigidBody(): cc.RigidBody;
        getSelfUID(): string;
        getSelfNodeUID(): string;
        getBodyNodeUID(node: cc.Node): string;
        getCompUID(comp: cc.Component): string;
        getNodeUID(node: cc.Node): string;
    }
}
declare namespace gcc.box2d.tools {
    class CCNodeUIDTool {
        uuidConvMap: {
            [key: string]: number;
        };
        uuidAcc: number;
        reset(): void;
        getUIDNum(uid: string): number;
        getBodyNodeUID(node: cc.Node): string;
        getCompUID(comp: cc.Component): string;
        getNodeUID(node: cc.Node): string;
    }
    const nodeUIDTool: CCNodeUIDTool;
}
declare const ConeCollider: any, SimplexCollider: any, AudioSource: typeof cc.AudioSource, Camera: typeof cc.Camera, Light: typeof cc.Light, MeshRenderer: typeof cc.MeshRenderer, SkinnedMeshRenderer: typeof cc.SkinnedMeshRenderer, SkinnedMeshBatchRenderer: any, SkinnedMeshUnit: any, DirectionalLight: any, SphereLight: any, SpotLight: any, Animation: typeof cc.Animation, AnimationComponent: any, SkeletalAnimation: any, Billboard: any, Line: any, ParticleSystem: typeof cc.ParticleSystem, Collider: typeof cc.Collider, BoxCollider: typeof cc.BoxCollider, SphereCollider: any, CapsuleCollider: any, MeshCollider: any, CylinderCollider: any, RigidBody: typeof cc.RigidBody, PhysicsMaterial: typeof cc.PhysicsMaterial, Canvas: typeof cc.Canvas, UIRenderable: any, UITransform: typeof cc.UITransform, Button: typeof cc.Button, EditBox: typeof cc.EditBox, Layout: typeof cc.Layout, Mask: typeof cc.Mask, ProgressBar: typeof cc.ProgressBar, RichText: typeof cc.RichText, ScrollBar: any, ScrollView: typeof cc.ScrollView, Slider: typeof cc.Slider, Sprite: typeof cc.Sprite, Toggle: typeof cc.Toggle, ToggleContainer: typeof cc.ToggleContainer, UIMeshRenderer: any, Widget: typeof cc.Widget, LabelOutline: typeof cc.LabelOutline, Graphics: typeof cc.Graphics, PageView: typeof cc.PageView, PageViewIndicator: typeof cc.PageViewIndicator, UIStaticBatch: any, UIOpacity: any, SafeArea: typeof cc.SafeArea, UICoordinateTracker: any, BlockInputEvents: typeof cc.BlockInputEvents, Label: typeof cc.Label;
declare namespace gcc.prefab {
    class ChildrenLoader extends cc.Component {
        childrenPrefabs: cc.Prefab[];
        private _showChildren;
        get showChildren(): boolean;
        set showChildren(value: boolean);
        protected updateChildrenView(): void;
        protected showPrivateChildren(): void;
        protected showProtectedChildren(): void;
        protected cleanChildren(): void;
        onLoad(): void;
    }
}
declare namespace gcc.prefab {
    class RuntimeNewNode extends cc.Component {
    }
}
declare namespace gcc.prefab {
    class SimpleNodeLoader extends cc.Component {
        childrenPrefabs: cc.Prefab[];
        siblingPrefabs: cc.Prefab[];
        siblingOrder: number;
        onLoad(): void;
    }
}
/**
 * 目标：
 * - 支持失败的资源重新加载生效
 * - 对于异步加载成功的节点，支持坐标更改应用
 */
declare namespace gcc.resloader {
    interface IResLoadListener<T> {
        onLoad(call: (res: T) => void): any;
        onError(call: (err: Error) => void): any;
    }
    /**
     * 资源加载通知
     */
    class ResLoadNotifier<T> implements IResLoadListener<T> {
        isFinished: boolean;
        isLoaded: boolean;
        err?: Error;
        res?: T;
        protected onLoadList: ((res: T) => void)[];
        onLoad(call: (res: T) => void): void;
        notifyOnLoad(res: T): void;
        protected onErrorList: ((err: Error) => void)[];
        onError(call: (err: Error) => void): void;
        notifyOnError(err: Error): void;
    }
    type LoadPrefabFunc = () => ResLoadNotifier<cc.Prefab>;
    type PrefabSource = string | ResLoadNotifier<cc.Prefab>;
    type CCPrefabLoadLisenter = IResLoadListener<cc.Prefab>;
    /**
     * 预制体动态加载工具
     */
    class ResLoader {
        protected loadMap: {
            [key: string]: ResLoadNotifier<any>;
        };
        getNotifier(uri: string): ResLoadNotifier<any>;
        existNotifier(uri: string): boolean;
        addNotifier(uri: string, notifier: ResLoadNotifier<any>): void;
        loadPrefab(url: string): CCPrefabLoadLisenter;
    }
    const resLoader: ResLoader;
}
declare namespace gcc.respool {
    interface IAsset {
        oid: number | string;
    }
    class AssetsManager {
        protected pool: {
            [key: string]: object;
        };
        protected getSubPool(key: string): object;
        put(key: string, asset: IAsset): void;
        putWithId(key: string, asset: any, oid?: string): void;
        getGroupKeys(key: string): string[];
        getWithDefault<T>(key: string, oid: string, call: () => T): T;
        get<T>(key: string, id?: string | number): T;
        delete(key: string, id: string): void;
        clearGroup(key: string): void;
    }
    const sharedAssetsManager: AssetsManager;
}
declare namespace gcc.respool {
    class ResMap<T> {
        resMap: {
            [key: string]: T;
        };
        getItem<F extends T = T>(key: string): F;
        setItem<F extends T = T>(key: string, item: F): void;
        clear(): void;
    }
    /**
     * 资源池
     */
    class ResPoolMap<T> {
        protected resPoolMap: {
            [key: string]: T[];
        };
        getResPool(key: string): T[];
        clear(): void;
        forEachAllRes(call: (node: T, key: string) => void): void;
    }
}
declare namespace gcc.respool {
    /**
     * cocos节点池
     */
    class CCNodePoolMap extends ResPoolMap<cc.Node> {
        loadPrefabRaw(prefabUrl: string, call: (prefab: cc.Prefab, err?: Error) => void): void;
        getOrCreateNodeWithPrefabUrl(prefabId: string, prefabUrl: string, call: (node: cc.Node, err: Error) => void): void;
        getOrCreateNodeWithPrefab(prefabId: string, prefab: cc.Prefab): cc.Node;
        getOrCreateNodeDynamicly(prefabId: string, prefabLoadListener: resloader.CCPrefabLoadLisenter, call: (node: cc.Node, err?: Error) => void): void;
        putNodeToCull(prefabId: string, node: cc.Node): void;
        putNodeToRemove(prefabId: string, node: cc.Node): void;
        clear(): void;
    }
}
declare namespace gcc.respool {
    /**
     * cocos节点池
     */
    class CCEasyNodePoolMap extends CCNodePoolMap {
        protected prefabUrlMap: {
            [key: string]: string;
        };
        protected prefabMap: {
            [key: string]: cc.Prefab;
        };
        protected prefabLoaderMap: {
            [key: string]: resloader.CCPrefabLoadLisenter;
        };
        protected loadAndSavePrefab(prefabId: string, prefabUrl: string, call?: (prefab: cc.Prefab, err?: Error) => void): void;
        registerPrefabUrl(prefabId: string, prefabUrl: string): void;
        registerPrefab(prefabId: string, prefab: cc.Prefab): void;
        registerPrefabLoader(prefabId: string, prefabLoadListener: resloader.CCPrefabLoadLisenter): void;
        loadPrefab(prefabId: string, call: (prefab: cc.Prefab, err?: Error) => void): void;
        getNode(prefabId: string): cc.Node;
        loadNode(prefabId: string, call: (node: cc.Node, err?: Error) => void): void;
        putNode(node: cc.Node, remove?: boolean): void;
    }
}
declare namespace gcc.respool {
    const CCNodeSaveKey = "mynodename";
    /**
     * cocos节点预加载工具
     */
    class CCNodePreloader extends ResPoolMap<cc.Node> {
        protected _preloadTaskMap: {
            [key: string]: number;
        };
        protected _preShowTask: {
            parent: cc.Node;
            duration: number;
        };
        init(): this;
        static getNodeKey(node: cc.Node): string;
        static isRecyclableNode(node: cc.Node): boolean;
        addPrefabLoadTask(url: string, count?: number): this;
        addPreShowTask(parent: cc.Node, duration?: number): this;
        execute(call: Function, onError?: (err: Error) => void): this;
        clearTasks(): this;
        instantiate(prefab: cc.Prefab): cc.Node;
        put(node: cc.Node): void;
    }
    const ccNodePreloader: CCNodePreloader;
}
declare namespace gcc.respool {
    class MyNodePool {
        private static nodePoolMap;
        static registerPrefabUrl(prefabId: string, prefabUrl: string): void;
        static put(node: cc.Node): void;
        static get(prefabId: string): cc.Node;
        static load(prefabId: string, call: (node: cc.Node, err?: Error) => void): void;
        static loadPrefab(prefabId: string, call: (prefab: cc.Prefab, err?: Error) => void): void;
    }
}
declare namespace gcc.transform {
    const Vec3: typeof cc.Vec3;
    type Vec3 = cc.Vec3;
    const Vec4: typeof cc.Vec4;
    type Vec4 = cc.Vec4;
    const Quat: typeof cc.Quat;
    type Quat = cc.Quat;
    /**
     * 需要改进，所有对cocos的依赖提前计算分离
     */
    export class TransformTool {
        init(): this;
        convVectorToPos3(pt: fsync.Vector3): Vec3;
        convPos3ToVector(pt: Vec3, pout?: fsync.Vector3): fsync.Vector3;
        convPos4ToVector(pt: Vec4): fsync.Vector4;
        convQuatToVector(pt: Quat): fsync.Vector4;
        swiftlyFollowRotateStep(entityManager: fsync.EntityManager, entity: fsync.Entity, targetRotation: fsync.Vector4, swiftParams: fsync.math.BezierParams2, dt: number): void;
        convertToWorldSpaceAR<T extends (cc.Vec2 | cc.Vec3)>(node: cc.Node, pos: T): T;
        getUITransform(node: cc.Node): cc.UITransform;
        setScale(node: cc.Node, scale: number): void;
        getWinSize(): cc.Size;
    }
    export const transformTool: TransformTool;
    export {};
}
declare namespace gcc.uit {
    class CCGameStick {
        /**
         * 整体节点
         */
        get viewNode(): cc.Node;
        set viewNode(value: cc.Node);
        /**
         * 触摸区域
         */
        get stickRange(): cc.Node;
        set stickRange(value: cc.Node);
        /**
         * 摇杆中心视图
         */
        get stickCenter(): cc.Node;
        set stickCenter(value: cc.Node);
        /**
         * 摇杆触摸点视图
         */
        get stickTouchPoint(): cc.Node;
        set stickTouchPoint(value: cc.Node);
        protected data: CCGameStick;
        loadFromJson(data: CCGameStick): void;
        stick: kitten.gamepad.CircleStick;
        syncViewData(stick: kitten.gamepad.CircleStick): void;
        updateMainView(): void;
        updateDetailView(): void;
        updateView(): void;
    }
}
declare namespace gcc.uit {
    class CCGamepad {
        get leftStick(): CCGameStick;
        set leftStick(value: CCGameStick);
        get rightStick(): CCGameStick;
        set rightStick(value: CCGameStick);
        get skillSticks(): CCGameStick[];
        get toDrawDebugView(): boolean;
        set toDrawDebugView(value: boolean);
        protected data: CCGamepad;
        loadFromJson(data: CCGamepad): void;
        gamepad: kitten.gamepad.NormalGamepad;
        onLoad(): void;
        start(): void;
        protected getSkillStickViews(): any[];
        updateViewVisible(): void;
        updateView(): void;
        update(): void;
        setSkillEnabled(index: number, b: boolean): void;
    }
}
declare namespace gcc.uit {
    /**
     * 鼠标滚轮数据
     */
    class ScrollData {
        curScroll: fsync.Vector3;
        deltaScroll: fsync.Vector3;
        update(): void;
    }
    /**
     * cocos触摸事件板
     */
    class CocosTouchPad {
        guesture: kitten.guesture.GuestureAnalyzer;
        scrollData: ScrollData;
        protected listenEvents: {
            [key: string]: Function;
        };
        init(): this;
        protected initEvents(): void;
        /**
         * 获取触摸事件坐标
         * @param touch
         */
        protected getTouchEventPos(touch: cc.Touch): fsync.Vector3;
        private testGuesture2;
        /**
         * 接触侦听触摸事件
         */
        unregisterTouchPad(): void;
        protected listenInfo: {
            node: cc.Node;
            useCapture: boolean;
        }[];
        /**
         * 注册触摸板事件
         * @param touchPad
         * @param useCapture 将触摸或鼠标事件注册在捕获阶段
         */
        registerTouchPad(touchPad: cc.Node, useCapture?: boolean): void;
    }
}
