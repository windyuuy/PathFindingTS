
import { _decorator, Component, Node } from 'cc';
import { ProceduralGridMover } from "./ProceduralGridMover";
const { ccclass, property } = _decorator;

@ccclass('ProceduralGridMoverComp')
export class ProceduralGridMoverComp extends Component {
	proxy: ProceduralGridMover = new ProceduralGridMover()

	start() {
		this.proxy.scan()
	}
}
