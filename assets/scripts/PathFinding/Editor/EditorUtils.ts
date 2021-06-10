
export class EditorUtils {
	static setAttrVisible(cls: Object, attrName: string, v: boolean) {
		let key = `${attrName}$_$visible`;
		let attrs = (cls as any)["__attrs__"]
		if (typeof (attrs) == "object") {
			attrs[key] = v;
		}
	}
}
