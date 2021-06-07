
export class CCRandom {
	Range(min: number, max: any): number {
		let rd = this.value;
		return min + (max - min) * rd
	}
	get value() {
		return Math.random()
	}
}

export const Random = new CCRandom()
