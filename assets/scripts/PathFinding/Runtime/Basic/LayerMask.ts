
import { _decorator, Component, Node, Vec3, Quat, Enum, Layers, BitMask, pipeline } from 'cc';
const { ccclass, property } = _decorator;

export type StrNumMap = { [key: string]: number }

export class LayerMask {
	public static UpdateLayer(cls: new () => any, attr: string, t: string) {
		var FinderLayerList = Layers.BitMask as StrNumMap;
		var attrs = (cls as any)["__attrs__"];
		var bitMasks = attrs[`${attr}$_$${t}List`] as { name: string, value: number }[];
		bitMasks.length = 0;
		for (var key in FinderLayerList) {
			if (typeof (FinderLayerList[key]) == "number") {
				bitMasks.push({ name: key, value: FinderLayerList[key] });
			}
		}
	}

	public static addLayer(name: string, value: number) {
		Layers.deleteLayer(value);
		Layers.addLayer(name, value);
	}

	public static addLayers(names: { [key: string]: number }) {
		for (var key in names) {
			this.addLayer(key, names[key])
		}
	}

	public static deleteLayer(name: string) {
		var value = (Layers.Enum as any)[name]
		Layers.deleteLayer(value);
	}

	public static nameToLayer(name: string): number {
		return (Layers.Enum as any)[name] as number
	}

	public static layerToName(index: number): string | null {
		var enums = Layers.Enum as StrNumMap;
		for (var name in enums) {
			if (enums[name] == index) {
				return name;
			}
		}
		return null
	}
}
