
import { _decorator, Component, Node, find } from 'cc';
import { PathFinder } from "../PathFinding/Editor/PathFinder";
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
        })()
        console.log("start")
    }
}
