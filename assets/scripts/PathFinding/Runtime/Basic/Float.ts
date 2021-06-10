
export class Float {
	public static readonly PositiveInfinity: number = Number.POSITIVE_INFINITY
	public static readonly NegativeInfinity: number = Number.NEGATIVE_INFINITY
	public static readonly Infinity: number = Number.POSITIVE_INFINITY
	public static Clamp(i: number, min: number, max: number): number {
		if (i < min) {
			return min;
		}
		if (i > max) {
			return max
		}
		return i;
	}
	public static readonly Epsilon = 1.401298E-45;


	// static Rad2Deg = 180 / Math.PI
	public static readonly Deg2Rad: number = 0.0174532924;
	// static Deg2Rad = Math.PI / 180
	public static readonly Rad2Deg: number = 57.29578;

	public static approximately(a: number, b: number) {
		if (a - b <= Float.Epsilon) {
			return true;
		}
		return false;
	}
}
