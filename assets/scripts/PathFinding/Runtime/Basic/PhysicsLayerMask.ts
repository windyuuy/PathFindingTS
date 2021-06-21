import * as cc from "cc"
import { BitMask, Enum, Layers, physics, PhysicsSystem } from "cc";
import { int } from "../Scan/CompatDef";
import { StrNumMap } from "./MapTypes";

export const myLayerList = {
	NONE: 0,
	DEFAULT: 1,
	ALL: 0xffffffff,
};

declare module "cc" {
	export namespace physics {
		export namespace PhysicsLayers {
			export let BitMask: typeof myLayerList;
			export let Enum: typeof myLayerList;
		}
	}
}

for (let key in myLayerList) {
	(PhysicsSystem.PhysicsGroup as any)[key] = (myLayerList as any)[key]
}

physics.PhysicsLayers = physics.PhysicsLayers || {

}

physics.PhysicsLayers.BitMask = BitMask({ ...PhysicsSystem.PhysicsGroup }) as any
physics.PhysicsLayers.Enum = PhysicsSystem.PhysicsGroup as any

export const PhysicsLayers = physics.PhysicsLayers

export class PhysicsLayerMask {
	public static UpdateAttrLayer(cls: new () => any, attr: string, t: string) {
		var FinderLayerList = PhysicsSystem.PhysicsGroup as any as StrNumMap;
		var attrs = (cls as any)["__attrs__"];
		var bitMasks = attrs[`${attr}$_$${t}List`] as { name: string, value: number }[];
		bitMasks.length = 0;
		for (var key in FinderLayerList) {
			if (typeof (key) != "number" && typeof (FinderLayerList[key]) == "number") {
				bitMasks.push({ name: key, value: FinderLayerList[key] });
			}
		}
	}

	public static addLayer(name: string, bitNum: number) {
		if (bitNum === undefined) {
			console.warn('bitNum can\'t be undefined');
			return;
		}
		if (bitNum > 19 || bitNum < 0) {
			console.warn('maximum layers reached.');
			return;
		}

		this.deleteLayer(name);

		const num = 1 << bitNum;
		(PhysicsLayers.Enum as any)[name] = num;
		(PhysicsLayers.Enum as any)[num] = name;
		(PhysicsLayers.BitMask as any)[name] = num;
		(PhysicsLayers.BitMask as any)[num] = name;
	}

	public static addLayers(names: { [key: string]: number }) {
		for (var key in names) {
			this.addLayer(key, names[key])
		}
	}

	public static deleteLayerMask(bitNum: number) {
		if (bitNum > 19 || bitNum < 0) {
			console.warn('do not change buildin layers.');
			return;
		}
		delete (PhysicsLayers.Enum as any)[(PhysicsLayers.Enum as any)[bitNum]];
		delete (PhysicsLayers.Enum as any)[bitNum];
		delete (PhysicsLayers.BitMask as any)[(PhysicsLayers.BitMask as any)[bitNum]];
		delete (PhysicsLayers.BitMask as any)[bitNum];
	}

	public static deleteLayer(name: string) {
		var value = (PhysicsLayers.Enum as any)[name]
		this.deleteLayerMask(value);
	}

	public static nameToLayer(name: string): number {
		return (PhysicsLayers.Enum as any)[name] as number
	}

	public static layerToName(index: number): string | null {
		var enums = PhysicsLayers.Enum as StrNumMap;
		for (var name in enums) {
			if (enums[name] == index) {
				return name;
			}
		}
		return null
	}

	public static GetMask(...layerNames: string[]): int {
		var mask = 0
		for (let name of layerNames) {
			let code = this.nameToLayer(name)
			mask |= code
		}

		return mask
	}

	public static ContainsAllLayers(target: number, layerMask: number): boolean {
		return (target & layerMask) == layerMask
	}

	public static ContainsAnyLayer(target: number, layerMask: number): boolean {
		return (target & layerMask) != 0
	}


}
