
import { _decorator, Component, Node, Vec3, Quat, Enum, Layers, BitMask, pipeline } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PathFinderDebugDrawOptions')
export class PathFinderDebugDrawOptions {
	@property({
		displayName: "启用调试绘图",
	})
	enableGraphicDrawer: boolean = false

	@property({
		displayName: "绘制网格地图",
	})
	needDrawGridMap: boolean = true

	@property({
		displayName: "绘制寻路路径",
	})
	needDrawFindingPath: boolean = true

	@property({
		displayName: "图层上移偏移",
	})
	upOffset: number = 0

	@property({
		displayName: "绘制不可行走节点",
	})
	showUnwalkableNodes: boolean = true

	@property({
		displayName: "节点尺寸",
	})
	drawNodeSize: number = 0.3

}
