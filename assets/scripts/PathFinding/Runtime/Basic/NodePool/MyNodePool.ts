
import * as cc from "cc"
export class MyNodePool {
	private static _nodePoolMap: gcc.respool.CCEasyNodePoolMap
	protected static get nodePoolMap(): gcc.respool.CCEasyNodePoolMap {
		if (this._nodePoolMap == null) {
			this._nodePoolMap = new gcc.respool.CCEasyNodePoolMap()
		}
		return this._nodePoolMap
	}
	protected static set nodePoolMap(value: gcc.respool.CCEasyNodePoolMap) {
		this._nodePoolMap = value
	}

	static put(node: cc.Node) {
		this.nodePoolMap.putNode(node)
	}

	static get(prefabId: string): cc.Node {
		return this.nodePoolMap.getNode(prefabId)
	}

	static load(prefabId: string, call: (node: cc.Node, err?: Error) => void) {
		this.nodePoolMap.loadNode(prefabId, (node, err) => {
			if (node != null) {
				call(node, err)
				return
			}

			this.nodePoolMap.getOrCreateNodeWithPrefabUrl(prefabId, prefabId, (node, err) => {
				if (node != null) {
					this.nodePoolMap.registerPrefabUrl(prefabId, prefabId)
				}
				call(node, err)
			})
		})
	}

	static registerPrefabUrl(prefabId: string, prefabUrl: string) {
		this.nodePoolMap.registerPrefabUrl(prefabId, prefabUrl)
	}
}
