import TYPES from '../../jssdk/types';
import { inject, injectable } from 'inversify';

type PageRecord = [ string, string ];
type ActivePoint = [ string, number ];

@injectable()
export class PageTracer implements PageTracer {

    // 边界情况的缓存
    _cacheKey: string = '';

    /**
     * 页面路由访问记录
     * @example
     * [
     *  [ '/a/index.html#1234', 'www.baidu.com/a/index.html' ],
     *  [ '/a/test.html#abcdefg', 'www.baidu.com/a/test.html' ]
     * ]
     */
    private _pageRecords: PageRecord[] = [];

    /**
     * 生成当前路由访问记录
     */
    private createPageRecord(): PageRecord {
        return [ this._.getPageId(), window.location.href ];
    }

    /**
     * 获取路由访问记录最后一条数据（当前路由）
     */
    private getCurrentPageRecord(): PageRecord {
        const { deepCopy, last, pipe } = this._;
        return pipe(last, deepCopy)(this._pageRecords);
    }

    /**
     * 单个页面活跃点记录
     * @example
     * [
     *  [ 'active', 1574228371756 ],
     *  [ 'inactive', 1574228381661 ],
     *  [ 'active', 1574228564657 ],
     *  [ 'inactive', 1574228572154 ]
     * ]
     */
    private _trace: ActivePoint[] = [];

    // 容器注入 | 工具
    private _: Utils;
    
    /**
     * 监控原生事件调用，分发浏览器事件
     */
    private bindPageTracerPatch() {
        window.history.pushState = this._.nativeCodeEventPatch(window.history, 'pushState');
        window.history.replaceState = this._.nativeCodeEventPatch(window.history, 'replaceState');
    }

    constructor(@inject(TYPES.Utils) _: Utils) {
        this._ = _;
        this.init();

        // MonkeyPatch
        this.bindPageTracerPatch();
    }

    /**
     * 记录活跃节点
     * @param {Number} timestamp 时间戳（可选）
     */
    active(timestamp?: number) {
        const { first, last } = this._;
        // 记录活跃节点
        const lastTrace = last(this._trace);
        // 当前行为栈内无节点，或者最后一个节点为不活跃节点
        (!lastTrace || (lastTrace && first(lastTrace) === 'inactive')) &&
        this._trace.push([ 'active', timestamp || Date.now() ]);
    }

    /**
     * 记录不活跃节点
     * @param {Number} timestamp 时间戳（可选）
     */
    inactive(timestamp?: number) {
        const { first, last } = this._;
        // 记录不活跃节点
        const lastTrace = last(this._trace);
        // 当前行为栈内最后一个节点为活跃节点
        lastTrace && first(lastTrace) === 'active' &&
        this._trace.push([ 'inactive', timestamp || Date.now() ]);
    }

    /**
     * 检查当前页面是否产生跳转
     */
    isRouteChange() {
        const { first, last, pipe } = this._;
        // 当前新路由
        const newPath = this._.getPageId();
        // 上一个路由
        const oldPath = pipe(last, first)(this._pageRecords);

        return newPath !== oldPath;
    }

    /**
     * 初始化
     */
    init() {
        // 更新页面访问记录
        this._pageRecords.push(this.createPageRecord());
        // 访问记录维护在10个
        this._pageRecords.length > 10 && this._pageRecords.shift();

        // 手动初始化活跃节点
        this._trace = [];
        this.active();
    }

    /**
     * 获取当前路由的停留相关的所有数据
     */
    treat() {

        // 手动记录一次不活跃节点
        this.inactive();
        // 计算进入、离开、停留时长、
        const [ enterTime, leaveTime, pageDwellTime ] = this.calc();
        const [ oldPath, oldUrl ] = this.getCurrentPageRecord();

        return [ enterTime, leaveTime, pageDwellTime, oldPath, oldUrl ];
    }

    /**
     * 只计算时长，不改变状态
     */
    calc() {
        const { first, last, pipe, pack } = this._;

        const enterTime = pipe(first, last)(this._trace);
        const leaveTime = pipe(last, last)(this._trace);
        const pageDwellTime = pack(2)(this._trace).reduce((temp: number, tar: ActivePoint[]) => {
            const activeTime = pipe(first, last)(tar);
            const inactiveTime = pipe(last, last)(tar);
            return temp += (inactiveTime - activeTime);
        }, 0);

        return [ enterTime, leaveTime, pageDwellTime || 0 ];
    }
}