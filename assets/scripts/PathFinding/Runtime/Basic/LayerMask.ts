
import * as cc from "cc"
import { _decorator, Component, Node, Vec3, Quat, Enum, Layers, BitMask, pipeline } from 'cc';
import { IS_CC_EDITOR } from "./Macro";
const { ccclass, property } = _decorator;

export type StrNumMap = { [key: string]: number }

/**
 * Layer.addLayer-fixbug
 * @param name 
 * @param bitNum 
 * @returns 
 */
Layers.addLayer = (name: string, bitNum: number) => {
	if (bitNum === undefined) {
		console.warn('bitNum can\'t be undefined');
		return;
	}
	if (bitNum > 19 || bitNum < 0) {
		console.warn('maximum layers reached.');
		return;
	}

	const num = 1 << bitNum;

	if (IS_CC_EDITOR) {
		delete (Layers.Enum as any)[num];
		delete (Layers.BitMask as any)[num];
		(Layers.Enum as any)[name] = num;
		(Layers.BitMask as any)[name] = num;
	} else {
		delete (Layers.Enum as any)[num];
		delete (Layers.BitMask as any)[num];

		(Layers.Enum as any)[name] = num;
		(Layers.Enum as any)[num] = name;
		(Layers.BitMask as any)[name] = num;
		(Layers.BitMask as any)[num] = name;
	}
}

export class LayerMask {
	public static UpdateLayer(cls: new () => any, attr: string, t: string) {
		var FinderLayerList = Layers.BitMask as StrNumMap;
		var attrs = (cls as any)["__attrs__"];
		var bitMasks = attrs[`${attr}$_$${t}List`] as { name: string, value: number }[];
		bitMasks.length = 0;
		for (var key in FinderLayerList) {
			if (typeof (key) != "number" && typeof (FinderLayerList[key]) == "number") {
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
