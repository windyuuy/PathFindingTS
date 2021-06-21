
export class CCRandom {
	RangeI(min: number, max: any): number {
		let rd = this.value;
		return Math.floor(min + (max - min) * rd)
	}
	RangeF(min: number, max: any): number {
		let rd = this.value;
		return min + (max - min) * rd
	}

	get value() {
		return Math.random()
	}
}

export const Random = new CCRandom()
