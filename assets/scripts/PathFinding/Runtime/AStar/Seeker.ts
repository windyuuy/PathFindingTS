

import { _decorator, Component, Node } from 'cc';
import { OnPathDelegate } from "./AStarSeeker";
const { ccclass, property } = _decorator;

@ccclass('Seeker')
// @_decorator.executeInEditMode
export class Seeker extends Component {
	pathCallback?: OnPathDelegate
}
