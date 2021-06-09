
import * as cc from "cc"

export function MyWaitForSeconds(secs: number): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		var id = setTimeout(() => {
			clearTimeout(id)
			resolve()
		}, secs * 1000)
	})
}

var sharedNode: cc.Node
var scheduler = cc.director.getScheduler()

export function WaitNull(): Promise<void> {
	var name = "_SharedNode_WaitForNull"
	if (sharedNode == null) {
		sharedNode = cc.find(name)!
	}
	if (sharedNode == null) {
		sharedNode = new cc.Node(name)
		sharedNode.parent = cc.find("")
	}
	return new Promise<void>((resolve, reject) => {
		var call = () => {
			scheduler.unschedule(call, sharedNode)
			resolve()
		}
		scheduler.schedule(call, sharedNode, 0)
	})
}
