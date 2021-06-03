
import { _decorator, Component, Node, find, Vec3 } from 'cc';
import { PathFinder } from "../PathFinding/Editor/PathFinder";
import { Seeker } from "../PathFinding/Runtime/AStar/Seeker";
import { LayerMask } from "../PathFinding/Runtime/Basic/LayerMask";
import { WaitForSeconds } from "../PathFinding/Runtime/Basic/WaitForSeconds";
const { ccclass, property } = _decorator;

@ccclass('Helloxx')
// @_decorator.executeInEditMode
export class Helloxx extends Component {
    start() {
        (async () => {
            await WaitForSeconds(1);
            var pathFinder = find("Nav")!.getComponent(PathFinder)!
            console.log("init")
            pathFinder.init()
            console.log("scanGraph")
            pathFinder.scanGraph()
            console.log("scanGraph done")

            var seek = this.addComponent(Seeker)!
            // var pos = this.node.position
            var pos = new Vec3(30, 0, 3)
            seek.startPath(pos, new Vec3(-10, 0, -10), (path) => {
                console.log("result:", path.isOk, path.vectorPath);
            });
        })()
        console.log("start")
    }
}
