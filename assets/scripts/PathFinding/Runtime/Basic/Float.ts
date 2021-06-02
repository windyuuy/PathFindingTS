
export class Float {
	static Clamp(i: number, min: number, max: number): number {
		if (i < min) {
			return min;
		}
		if (i > max) {
			return max
		}
		return i;
	}
	public static Epsilon = 1.401298E-45;
	public static Deg2Rad: number = 0.0174532924;
	public static Rad2Deg: number = 57.29578;

	public static approximately(a: number, b: number) {
		if (a - b <= Float.Epsilon) {
			return true;
		}
		return false;
	}
}
