
import { _decorator, Component, Node, find, Vec3 } from 'cc';
import { PathFinder } from "../Editor/PathFinder";
import { Seeker } from "../Runtime/AStar/Seeker";
import { LayerMask } from "../Runtime/Basic/LayerMask";
import { WaitForSeconds } from "../Runtime/Basic/WaitForSeconds";
import { TestCase } from "./TestCase";
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
            seek.needDrawDebug = true
            var poses = [
                // new TestCase(new Vec3(0, 0, 0), new Vec3(0, 0, 0)),
                // new TestCase(new Vec3(0, 0, 0), new Vec3(10, 0, 10)),
                // new TestCase(new Vec3(0, 0, 0), new Vec3(-10, 0, 10)),
                // new TestCase(new Vec3(0, 0, 0), new Vec3(-10, 0, -10)),
                // new TestCase(new Vec3(0, 0, 0), new Vec3(10, 0, -10)),
                // new TestCase(new Vec3(10, 0, 10), new Vec3(-10, 0, -10)),
                // new TestCase(new Vec3(-10, 0, -10), new Vec3(-10, 0, -10)),
                // new TestCase(new Vec3(40, 0, 40), new Vec3(-10, 0, -10)),
                // new TestCase(new Vec3(40, 0, 4), new Vec3(-10, 0, -10)),
                // new TestCase(new Vec3(4, 0, 4), new Vec3(-10, 0, -10)),
                // new TestCase(new Vec3(4, 0, 40), new Vec3(-10, 0, -10)),
                // new TestCase(new Vec3(0, 0, 40), new Vec3(-10, 0, -10)),
                // new TestCase(new Vec3(40, 0, 0), new Vec3(-10, 0, -10)),
                new TestCase(new Vec3(0, 0, 0), new Vec3(10, 0, 15)),
                new TestCase(new Vec3(4, 0, 4), new Vec3(10, 0, 15)),
            ]
            for (var c of poses) {
                var result = seek.startPath(c.start, c.end, (path) => {
                    console.log("result:", path.isOk, path.vectorPath);
                })!;
                c.paths = result.vectorPath
                if (!c.check()) {
                    console.error("unmatched result")
                }
            }
        })()
        console.log("start")
    }
}
