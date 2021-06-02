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
    find(callback: (a: T) => boolean): T
}
