// declare module 'rx';
declare module 'whats-element/src/whatsElementPure';
declare var ha: any;

type Obj = { [ x: string ]: any };
type Fn = (...args: any[]) => any;

// 工具类
interface Utils {

    (): Utils;

    [x: string]: any;

    hashInRange: (range: number, str: string) => string;

    /**
     * compose 反向管道
     */
    compose: (...fns: Function[]) => Function;

    /**
     * pipe 管道
     */
    pipe: (...fns: Function[]) => Function;

    /**
     * 按指定个数包装数组
     * @example
     * pack(2)([ 1, 2, 3, 4, 5 ]) -> [ [1, 2], [3, 4], [5] ]
     * pack(3)([ 1, 2, 3, 4, 5 ]) -> [ [1, 2, 3], [4, 5] ]
     */
    pack: (arity: number) => (arr: any[]) => Array<Array<any>>;

    first: (arr: any[]) => any;

    last: (arr: any[]) => any;

    /**
     * 本地缓存封装
     */
    SessStorage: CustomStorage;
    LocStorage: CustomStorage;

    /**
     * tab 页上保存的数据，实际保存在 window.data，提供存取操作
     */
    windowData: {
        get(key?: string): any;
        set(key: string, val: any): void;
        remove(key: string): void;
        clear(): void;
    }

    /**
     * 获取页面唯一路径（加上hash）
     */
    getPageId: () => string;

    /**
     * 获取页面唯一路径，并根据提供的 publicPath 切割路径，得到生成与测试环境统一的 pathId
     */
    normalizePageId: (publicPath: string) => string;

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
     * 判断字符串是否为json
     * @param {String} str 待判断的字符串
     */
    isJson: (str: string) => boolean;

    /**
     * 检测客户端是否支持 Beacon 发送数据
     */
    isSupportBeacon: () => boolean;

    /**
     * 深拷贝（JSON）
     */
    deepCopy: <T>(obj: any) => T;

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
     * 生成缓存索引（带 chunk ）
     */
    createCacheKey: () => string

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
     * @param {String} curPageId 当前页面 pageId ，用于校验 pid 是否存在于当前页面
     * @param {String} pid 元素唯一标识
     */
    getElemByPid: (curPageId: string, pid: string) => HTMLElement;

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

    /**
     * 监控原生事件调用，分发浏览器事件
     * @param {any} orig 原生对象（触发原生事件的上下文）
     * @param {String} type 期望监控原生对象上发生的事件名称，将作为分发的自定义事件的事件名（将转换为小写）
     */
    nativeCodeEventPatch: (orig: any, type: string) => any;
}
interface CustomStorage {
    get: (key?: string) => any;
    set: (key: string, val: any) => void,
    remove: (key: string) => void,
    clear: () => void;
}

interface AppEvent {
    click: (config: Obj) => any;
    mousemove: (config: Obj) => any;
    load: () => any;
    beforeUnload: () => any;
    pageShow: () => any;
    pageHide: () => any;
    hashchange: () => any;
    popstate: () => any;
    pushState: () => any;
    replaceState: () => any;
    visibilitychange: () => any;
    online: () => any;
    offline: () => any;
    message: () => any;
    messageOf: (tag: string) => any;
    netStatusChange: () => any;
    routeChange: () => any;
    pageVisible: () => any;
    pageHidden: () => any;
}

interface Service {
    ERR_OK: string,

    setHeader: (newHeader: Obj) => Obj;

    /**
     * 登录接口
     */
    appLoginAPI: (data?: any) => Promise<any>,

    /**
     * 日志上报
     */
    reportAPI: (data: FormData) => Promise<any>,

    /**
     * 日志上报 useBeacon
     */
    reportBeaconAPI: (data: FormData) => boolean,

    getPresetPointsAPI: (data: Obj) => Promise<any>,
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
    get(key?: string): any;
    set(key: string, data: Obj): void;
    merge(data: Obj): void;
    // getSelf(): Obj;
}

type UserInfo = {
    appId: string;
    sysId: string;
    openId: string;
}
type ClientInfo = {
    [x: string]: string;
    batchId: string;
    clientType: string;
    sysVersion: string;
    userNetWork: string;
};

type Msg = {
    type: number,
    funcId: string,
    preFuncId: string,
    pageId: string,
    sysId: string,
    isSysEvt: string,
    msg: string
}

interface MsgsQueue {
    _queue: Msg[];
    onLoad(): void;
    onUnload(): void;
    bindCustomer(cstm: { notify: Function }): void;
    getQueue(): Msg[];
    push(data: Msg | Msg[]): void;
    pull(): Msg[];
}

interface ReportStrategy {
    info: ClientInfo;
    controller: 'storage' | 'server';
    // notify(data: Msg[]): (data: Msg[]) => Promise<boolean>;
    report: (data: Msg[], opt: Obj) => Promise<boolean>;
    report2Storage(msgs: Msg[]): Promise<boolean>;
    report2Server(msgs: Msg[], opt: Obj): Promise<boolean> | boolean;
    resend(): void;
}

interface PageTracer {
    active(timestamp?: number): void;
    inactive(timestamp?: number): void;
    isRouteChange(): boolean;
    init(): void;
    treat(): any[] | null;
    calc(): [ number, number, number ];
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
    splitUrl: (host: string, path: string, data?: Obj) => string;
    setHeader: (newHeader: Obj) => Obj;
    get: (host: string, url: string, data: Obj | null, options?: RequestOptions) => Promise<any>;
    post: (host: string, url: string, data: Obj | null, options?: RequestOptions) => Promise<any>;
    put: (host: string, url: string, data: Obj | null, options?: RequestOptions) => Promise<any>;
    delete: (host: string, url: string, options?: RequestOptions) => Promise<any>;
    url: (host: string, url: string) => string;
}

interface HXAnalytics {
    push(data: Obj): void;
}