
export interface BuiltinObject {
	collisionFilterGroup: number;

	collisionFilterMask: number;

	/** group */
	getGroup(): number

	setGroup(v: number): void

	addGroup(v: number): void

	removeGroup(v: number): void

	/** mask */
	getMask(): number

	setMask(v: number): void

	addMask(v: number): void

	removeMask(v: number): void
}
