
import { _decorator, Component, Node } from 'cc';
import { PathFinderOptions } from "./PathFinderOptions";
const { ccclass, property } = _decorator;

@ccclass('PathFinder')
@_decorator.executeInEditMode
export class PathFinder extends Component {

    @property({
        type: PathFinderOptions,
    })
    options: PathFinderOptions = new PathFinderOptions();

    start() {
        PathFinderOptions.start();
    }

    update(deltaTime: number) {
        // [4]
        PathFinderOptions.update();

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
