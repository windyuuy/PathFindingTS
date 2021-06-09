
import { _decorator, Component, Node, find, Vec3, path, SphereCollider } from 'cc';
import { AA } from "../../test/AA";
import { PathFinder } from "../Editor/PathFinder";
import { Seeker } from "../Runtime/AStar/Seeker";
import { LayerMask } from "../Runtime/Basic/LayerMask";
import { WaitForSeconds } from "../Runtime/Basic/WaitForSeconds";
import { AstarPath } from "../Runtime/Scan/AstarPath";
import { TestCase } from "./TestCase";
const { ccclass, property } = _decorator;

@ccclass('Helloxx')
// @_decorator.executeInEditMode
export class Helloxx extends Component {
    start() {
        // let wef = new Node()
        // wef.parent = this.node;
        // let col = wef.addComponent(SphereCollider)

        let _ = (async () => {
            await WaitForSeconds(0.1);
            var pathFinder = find("Nav")!.getComponent(PathFinder)!
            console.log("init")
            pathFinder.init()
            console.log("scanGraph")
            // await pathFinder.scanGraphAsync()
            // pathFinder.scanGraphAsync()
            pathFinder.scanGraph()
            // this.node.position = new Vec3(1, 1, 1)
            // pathFinder.scanGraph()
            AstarPath.active.AddWorkItem(() => {
                console.log("work item done")
            })
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
                // new TestCase(new Vec3(10, 0, 10), new Vec3(10, 0, -10)),
                // new TestCase(new Vec3(10, 0, 10), new Vec3(-10, 0, 10)),
                // new TestCase(new Vec3(10, 0, 10), new Vec3(10, 0, 10)),
                // new TestCase(new Vec3(10, 0, 10), new Vec3(20, 0, 20)),
                // new TestCase(new Vec3(-10, 0, -10), new Vec3(-10, 0, -10)),
                // new TestCase(new Vec3(-10, 0, -10), new Vec3(10, 0, 10)),
                // new TestCase(new Vec3(-10, 0, -10), new Vec3(-10, 0, 10)),
                // new TestCase(new Vec3(-10, 0, -10), new Vec3(10, 0, -10)),
                // new TestCase(new Vec3(40, 0, 4), new Vec3(-10, 0, -10)),
                // new TestCase(new Vec3(4, 0, 4), new Vec3(-10, 0, -10)),
                // new TestCase(new Vec3(4, 0, 40), new Vec3(-10, 0, -10)),
                // new TestCase(new Vec3(0, 0, 40), new Vec3(-10, 0, -10)),
                // new TestCase(new Vec3(40, 0, 0), new Vec3(-10, 0, -10)),
                // new TestCase(new Vec3(0, 0, 0), new Vec3(10, 0, 15)),
                // new TestCase(new Vec3(4, 0, 4), new Vec3(10, 0, 15)),
                // new TestCase(new Vec3(40, 0, 40), new Vec3(-10, 0, -10)),
                // new TestCase(new Vec3(60, 0, 60), new Vec3(-10, 0, -10)),
                // new TestCase(new Vec3(60, 0, 60), new Vec3(-10, 0, -60)),
                // new TestCase(new Vec3(40, 0, 40), new Vec3(-40, 0, -10)),
                new TestCase(new Vec3(60, 0, 60), new Vec3(-60, 0, -10)),
            ]
            for (var c of poses) {
                var result = await seek.startPath(c.start, c.end, (path) => {
                    console.log("result:", path.isOk, path.vectorPath);
                });
                if (result.isOk) {
                    c.paths = result!.vectorPath
                    if (!c.check()) {
                        console.error("unmatched result")
                    }
                } else {
                    throw new Error("find path failed")
                }
            }
        })()
        console.log("start")
    }
}
