
import { Vec3 } from "cc";
import { _decorator, Component, Node, Graphics, resources, Prefab, NodePool, PrivateNode } from 'cc';
import { LayerMask } from "../Runtime/Basic/LayerMask";
import { IS_CC_EDITOR } from "../Runtime/Basic/Macro";
import { MyNodePool } from "../Runtime/Basic/NodePool/MyNodePool";
import { AstarPath } from "../Runtime/Scan/AstarPath";
import { ProceduralGridMover } from "../Runtime/Scan/ProceduralGridMover";
import { PathFinderOptions } from "./PathFinderOptions";
const { ccclass, property } = _decorator;

@ccclass('PathFinder')
@_decorator.executeInEditMode
export class PathFinder extends Component {

    @property({
        type: [PathFinderOptions],
    })
    options: PathFinderOptions[] = [new PathFinderOptions()]

    @property({
        displayName: "启用性能日志",
    })
    enablePerformaceLog: boolean = false

    // get graphs(): PathFinderOptions[] {
    //     // return AstarPath.active.graphs;
    //     return this._graphs;
    // }
    // set graphs(value: PathFinderOptions[]) {
    //     AstarPath.active.graphs = value;
    //     this._graphs = value;
    // }

    get pathHandler() {
        return AstarPath.active
    }

    onLoad() {
        if (!IS_CC_EDITOR) {
            this.init();
        }
    }

    start() {
        try {
            PathFinderOptions.start(this.options);
        } catch (e) {
            console.error(e)
        }

        if (!IS_CC_EDITOR) {
            MyNodePool.registerPrefabUrl("PathHint", "PathFinding/Res/PathHint/PathHint")
            MyNodePool.registerPrefabUrl("GridHint", "PathFinding/Res/GridHint/GridHint")
        }
    }

    update(deltaTime: number) {
        try {
            PathFinderOptions.update(this.options);

            AstarPath.active.update();
        } catch (e) {
            console.error(e)
        }
    }

    lateUpdate(deltaTime: number) {
        try {
            PathFinderOptions.lateUpdate(this.options);
        } catch (e) {
            console.error(e)
        }
    }

    protected _inited: boolean = false
    /**
     * 初始化
     */
    init() {
        if (this._inited) {
            return
        }
        this._inited = true

        AstarPath.active.options = this.options;
        AstarPath.active.enablePerformaceLog = this.enablePerformaceLog;
        AstarPath.active.init()
        // AstarPath.active.graphic = this.addComponent(Graphics)

        if (AstarPath.active.graphicRoot == null || AstarPath.active.graphicRoot.parent != this.node) {
            var graphicRoot = new PrivateNode("FindPathGraphicRoot")
            graphicRoot.parent = this.node
            AstarPath.active.graphicRoot = graphicRoot
            graphicRoot.setWorldPosition(Vec3.ZERO)
        }
    }
    /**
     * 扫描地图
     */
    scanGraph() {
        AstarPath.active.scanGraph()
    }

    /**
     * 扫描地图
     */
    async scanGraphAsync() {
        await AstarPath.active.scanGraphAsync()
    }

}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
