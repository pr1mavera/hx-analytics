declare module 'rx';
declare module 'whats-element/src/whatsElementPure';

type Obj = { [ x: string ]: any };
type Fn = (...args: any[]) => any;
// type Cast<X, Y> = X extends Y ? X : Y;
type Length<T extends any[]> = T['length'];
// type Drop<N extends number, T extends any[], I extends any[] = []> = {
//     0: Drop<N, Tail<T>, Prepend<any, I>>
//     1: T
//   }[Length<I> extends N ? 1 : 0];
// type Currying<F extends ((...arg: any) => R), R> = <T extends any[]>(...args: T) => ;
// type Curry<P extends any[], R> = (fn: ((...args) => R), arity?: number) => <T extends any[]>(...args: T) => ;

// 工具类
interface Utils {

    (): Utils;

    [x: string]: any;

    /**
     * map 原生对象方法柯里化
     * @param {Function} mapper 映射过程
     * @param {Array} obj 原生对象
     */
    map: (...arg: any[]) => any;

    /**
     * 原生对象方法柯里化，将原生对象后置传递
     * @param {String} methodName 方法名
     * @param {Number} argCount 柯里化函数传递的参数个数，默认为2
     */
    // unboundMethod: <T>(methodName: string, argCount?: number) => Curry<T>;
    unboundMethod: (...arg: any[]) => any;

    /**
     * 柯里化
     * @param {Function} fn 待柯里化的函数
     * @param {Number} arity 柯里化函数传递的参数个数，默认为形参个数
     */
    // curry: Curry;
    curry: (...arg: any[]) => any;

    /**
     * 本地缓存封装
     */
    SessStorage: CustomStorage;
    LocStorage: CustomStorage;

    /**
     * 判断应用是否在 iframe 内
     */
    inIframe: () => boolean;

    /**
     * 判断是否是某类型
     * @param {String} _type 类型(字符串)
     * @param {Any} _staff 待判断的内容
     */
    isType: (type: string, staff: any) => boolean;

    /**
     * 字符串首字母大写
     * @param {String} str 字符串
     */
    firstUpperCase: (str: string) => string;

    /**
     * query 字符串拆箱
     * @param {String} str query 字符串
     */
    splitQuery: (str: string) => Obj;

    /**
     * 生成访问记录唯一标识
     * @param {String} appId 应用id
     */
    createVisitId: (this: Utils, appId: string) => string;

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

    /**
     * 生成元素唯一标识
     * @param {String} sysId 系统id
     * @param {String} pageId 页面id
     * @param {HTMLElement} e dom元素
     */
    getElemPid: (sysId: string, pageId: string, e: HTMLElement) => string | null;

    /**
     * 根据元素唯一标识获取元素
     * @param {String} pid 元素唯一标识
     */
    getElemByPid: (pid: string) => HTMLElement;

    /**
     * 根据元素相对视窗的位置信息
     * @param {Element} e 元素
     * @returns 
     * [
     *      left,   元素相对视窗的横轴距离
     *      top,    元素相对视窗的纵轴距离
     *      width,  元素宽
     *      height  元素高
     * ]
     */
    getElemClientRect: (e: Element) => [ number, number, number, number ];

    /**
     * Promise 同步错误处理
     * @param {Function} asyncFn Promise工厂
     * @param {Function} formatter 输出数据包格式化，纯函数，可选
     * @param {Array} rest Promise工厂函数入参
     * 
     * @returns
     * [
     *      err: 出错情况下的错误信息,
     *      res: 正常情况下的数据包
     * ]
     */
    errorCaptured: (
        asyncFn: (...arg: any) => Promise<any>,
        formatter: ((x: any) => any) | null,
        ...rest: any[]
    ) => Promise<[ Obj | null, any ]>;

    /**
     * 获取设备信息
     */
    deviceInfo: () => { name: string, version: number, browser: string, connType: string };

    // /**
    //  * 装饰器 | 混合属性
    //  * @param {Array} ...list 待混合属性的数组
    //  */
    // mixins: (...list: Obj[]) => (...x: any[]) => void;

    // reloadConstructor: <T extends { new(...args:any[]): {} }>(constructor: T) => 
}
interface CustomStorage {
    get: (key: string) => any;
    set: (key: string, val: any) => void,
    remove: (key: string) => void,
    clear: () => void;
}

interface AppEvent {
    click: (config: Obj) => any;
    mousemove: (config: Obj) => any;
    load: () => any;
    beforeUnload: () => any;
    hashchange: () => any;
    popstate: () => any;
    visibilitychange: () => any;
    online: () => any;
    offline: () => any;
    message: () => any;
    messageOf: (tag: string) => any;
    netStatusChange: () => any;
}

interface Service {
    ERR_OK: string,

    setHeader: (newHeader: Obj) => Obj;

    /**
     * 
     */
    appLoginAPI: (data?: any) => Promise<any>,

    /**
     * 日志上报
     */
    reportAPI: (data: {
        [x: string]: any;
        msgs: {
            msg: string;
            sysId: string;
            pageId: string;
            funcId: string;
            type: number;
        }[]
    }) => Promise<any>,

    getPresetPointsAPI: (data?: Obj) => Promise<any>,
}

interface EventSubscriber<T extends { [x: string]: any, modeType: string }, S extends { unsubscribe(): void }> {
    ctx: T;
    subs: S[];
    init(ctx: T): EventSubscriber<T, S>;
    subscribe(): void;
    unsubscribe(): void;
    on(event: string, sub: S): void;
    off(event: string): void;
}

type Rect = [ number, number, number, number ];
interface PointBase {
    pid: string;
}
interface Point extends PointBase {
    pid: string;
    tag: string;
    rect: number[];
    create(origin: PointBase | EventTarget): Point;
}
interface DomMasker {
    _INITED: boolean;
    // 预设埋点
    points: Point[];
    // 当前圈选埋点
    activePoint: Point;

    // 主绘制canvas
    canvas: HTMLCanvasElement;
    // 缓存canvas
    tempCanvas: HTMLCanvasElement;
    init(): void;
    preset(points: PointBase[]): void;
    clear(): void;
    reset(): void;
    render(ctx: CanvasRenderingContext2D, point: Point): void;
}

interface AppConfig extends Obj {
    set(data: Obj): void;
    get(key: string): any;
    getSelf(): Obj;
}

type UserInfo = {
    appId: string;
    openId: string;
}
type ClientInfo = {
    [x: string]: string;
    batchId: string;
    clientType: string;
    sysVersion: string;
    userNetWork: string;
};

interface ReportStrategy {
    info: ClientInfo;
    controller: 'storage' | 'server';
    report: (data: Obj) => void;
    report2Storage(msgs: Obj[]): void;
    report2Server(msgs: Obj[], ignoreErr?: boolean): Promise<boolean>;
    resend(): void;
}

// 模式生命周期
interface ModeLifeCycle {
    readonly modeType: string;
    // subs: any[];
    // events?: Obj;
    onEnter(options?: Obj): void;
    onExit(): void;
    onTrigger(data: any): void;
}
// declare class EventsSubscriber {
//     subs: [Subscription];
//     constructor();
//     subscribe(): void;
//     unsubscribe(): void;
// }

// 请求方式
type RequestMethods = 'DELETE' | 'GET' | 'HEAD' | 'POST' | 'PUT';
// 请求额外选项
interface RequestOptions {
    headers?: Obj;
    [propName: string]: any;
}
// 请求
type SafeRequest = {
    setHeader: (newHeader: Obj) => Obj;
    get: (host: string, url: string, data: Obj | null, options?: RequestOptions) => Promise<any>;
    post: (host: string, url: string, data: Obj | null, options?: RequestOptions) => Promise<any>;
    put: (host: string, url: string, data: Obj | null, options?: RequestOptions) => Promise<any>;
    delete: (host: string, url: string, options?: RequestOptions) => Promise<any>;
    url: (host: string, url: string) => string;
}

interface HXAnalytics {
    init(user: UserInfo): Promise<any>;
    push(data: Obj): void;
}