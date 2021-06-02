
import { _decorator, Component, Node } from 'cc';
import { LayerMask } from "../Runtime/Basic/LayerMask";
import { AstarPath } from "../Runtime/Scan/AstarPath";
import { ProceduralGridMover } from "../Runtime/Scan/ProceduralGridMover";
import { PathFinderOptions } from "./PathFinderOptions";
const { ccclass, property } = _decorator;

@ccclass('PathFinder')
// @_decorator.executeInEditMode
export class PathFinder extends Component {

    @property({
        type: [PathFinderOptions],
    })
    graphs: PathFinderOptions[] = [new PathFinderOptions()]
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

    start() {
        PathFinderOptions.start();
    }

    update(deltaTime: number) {
        // [4]
        PathFinderOptions.update();
    }
    /**
     * 初始化
     */
    init() {
        AstarPath.active.graphs = this.graphs;
        AstarPath.active.init()
    }
    /**
     * 扫描地图
     */
    scanGraph() {
        AstarPath.active.scanGraph()
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
