interface _ {
    () : _;

    /**
     * 判断应用是否在 iframe 内
     */
    inIframe: () => boolean;

    /**
     * 生成访问记录唯一标识
     * @param {String} appId 应用id
     */
    createVisitId: (this: _, appId: string) => string;

    /**
     * 日期格式化
     * @param {String} format 期望日期格式
     * @param {Date} date 时间对象，可选，若不传则默认为当前时间
     */
    formatDate: (format: string, date?: Date) => string;

    /**
     * 生成一定范围内的随机数
     * @param {Number} min 最小值
     * @param {Number} max 最大值
     */
    randomInRange: (min: number, max: number) => number;
}