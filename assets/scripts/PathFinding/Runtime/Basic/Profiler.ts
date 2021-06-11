
export class _TMyProfiler {
	protected overviews: { [key: string]: { duration: number, count: number, curCost: number } } = {}
	protected sampleStack: { name: string, start: number }[] = []

	public BeginSample(name: string) {
		this.sampleStack.push({ name, start: Date.now() })
	}

	protected curName?: string
	public EndSample(): void {
		let sample = this.sampleStack.pop()
		if (sample != null) {
			this.curName = sample.name
			if (this.overviews[sample.name] == null) {
				this.overviews[sample.name] = {
					count: 0,
					duration: 0,
					curCost: 0,
				}
			}

			let o = this.overviews[sample.name]
			let t2 = Date.now()
			o.curCost = (t2 - sample.start)
			o.duration += o.curCost
			o.count++
		}
	}
	public GetCurCost(name: string) {
		if (this.overviews[name] != null) {
			return this.overviews[name].curCost
		}
		return 0
	}
	public TypeCurCost() {
		if (this.curName != null) {
			let cost = this.GetCurCost(this.curName)
			console.log(`${this.curName}-timecost: ${cost} ms`)
		}
	}
}

export const MyProfiler = new _TMyProfiler()
