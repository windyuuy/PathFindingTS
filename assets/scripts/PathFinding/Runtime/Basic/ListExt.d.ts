interface Array<T> {
	/**
	 * 从列表中移除某个对象
	 */
	remove(item: T): Array<T>;

	/**
	 * 计算某表达式的和
	 */
	sum(callback: (a: T) => number): number;

	/**
	 * 将二维数组降为一唯数组
	 * 例:[[1,2,3],[4,5,6]]=>[1,2,3,4,5,6]
	 */
	unpack(): T;

	/**
	 * 兼容es5浏览器
	 * @param callback 
	 */
	find<S extends T>(predicate: (this: void, value: T, index: number, obj: T[]) => value is S, thisArg?: any): S | undefined;
	find(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): T | undefined;

	/**
	 * 清空元素, 容量清零
	 */
	clear(): void

	/**
	 * 判断是否包含元素
	 * @param item 
	 */
	contains<T>(item: T): boolean;

	/**
	 * 复制元素
	 * @param array 
	 * @param index 
	 */
	copyTo(array: T[], index: number): void;
}
