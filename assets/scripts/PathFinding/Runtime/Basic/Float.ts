
export class Float {
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
