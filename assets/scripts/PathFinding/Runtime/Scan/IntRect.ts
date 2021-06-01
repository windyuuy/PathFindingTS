export class IntRect {
	public xmin!: number
	public ymin!: number
	public xmax!: number
	public ymax!: number

	public constructor(xmin: number, ymin: number, xmax: number, ymax: number) {
		this.xmin = xmin;
		this.xmax = xmax;
		this.ymin = ymin;
		this.ymax = ymax;
	}

	public Contains(x: number, y: number): boolean {
		return !(x < this.xmin || y < this.ymin || x > this.xmax || y > this.ymax);
	}

	public get Width(): number {
		return this.xmax - this.xmin + 1;
	}

	public get Height(): number {
		return this.ymax - this.ymin + 1;
	}

	/// <summary>
	/// Returns if this rectangle is valid.
	/// An invalid rect could have e.g xmin > xmax.
	/// Rectamgles with a zero area area invalid.
	/// </summary>
	public get IsValid(): boolean {
		return this.xmin <= this.xmax && this.ymin <= this.ymax;
	}

	public static equals(a: IntRect, b: IntRect): boolean {
		return a.xmin == b.xmin && a.xmax == b.xmax && a.ymin == b.ymin && a.ymax == b.ymax;
	}

	public static unequals(a: IntRect, b: IntRect): boolean {
		return a.xmin != b.xmin || a.xmax != b.xmax || a.ymin != b.ymin || a.ymax != b.ymax;
	}

	public GetHashCode(): number {
		return this.xmin * 131071 ^ this.xmax * 3571 ^ this.ymin * 3109 ^ this.ymax * 7;
	}

	/// <summary>
	/// Returns the intersection rect between the two rects.
	/// The intersection rect is the area which is inside both rects.
	/// If the rects do not have an intersection, an invalid rect is returned.
	/// See: IsValid
	/// </summary>
	public static Intersection(a: IntRect, b: IntRect): IntRect {
		return new IntRect(
			Math.max(a.xmin, b.xmin),
			Math.max(a.ymin, b.ymin),
			Math.min(a.xmax, b.xmax),
			Math.min(a.ymax, b.ymax)
		);
	}

	/// <summary>Returns if the two rectangles intersect each other</summary>
	public static Intersects(a: IntRect, b: IntRect): boolean {
		return !(a.xmin > b.xmax || a.ymin > b.ymax || a.xmax < b.xmin || a.ymax < b.ymin);
	}

	/// <summary>
	/// Returns a new rect which contains both input rects.
	/// This rectangle may contain areas outside both input rects as well in some cases.
	/// </summary>
	public static Union(a: IntRect, b: IntRect): IntRect {
		return new IntRect(
			Math.min(a.xmin, b.xmin),
			Math.min(a.ymin, b.ymin),
			Math.max(a.xmax, b.xmax),
			Math.max(a.ymax, b.ymax)
		);
	}

	/// <summary>Returns a new IntRect which is expanded to contain the point</summary>
	public ExpandToContain(x: number, y: number): IntRect {
		return new IntRect(
			Math.min(this.xmin, x),
			Math.min(this.ymin, y),
			Math.max(this.xmax, x),
			Math.max(this.ymax, y)
		);
	}

	/// <summary>Returns a new rect which is expanded by range in all directions.</summary>
	/// <param name="range">How far to expand. Negative values are permitted.</param>
	public Expand(range: number): IntRect {
		return new IntRect(
			this.xmin - range,
			this.ymin - range,
			this.xmax + range,
			this.ymax + range
		);
	}

	public ToString(): string {
		return "[x: " + this.xmin + "..." + this.xmax + ", y: " + this.ymin + "..." + this.ymax + "]";
	}

}