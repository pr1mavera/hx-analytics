import TYPES from '../../jssdk/types';
import { inject, injectable } from 'inversify';

type PageRecord = [ string, string ];
type ActivePoint = [ string, number ];

@injectable()
export class PageTracer implements PageTracer {

    /**
     * 页面路由访问记录
     * @example
     * [
     *  [ '/a/index.html#1234', 'www.baidu.com/a/index.html' ],
     *  [ '/a/test.html#abcdefg', 'www.baidu.com/a/test.html' ]
     * ]
     */
    private _pageRecord: PageRecord[] = [];

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

    constructor(@inject(TYPES.Utils) _: Utils) {
        this._ = _;
        this._pageRecord.push(this.getCurrentPageRecord());
        // 手动初始化第一次页面活跃节点
        this.active();
    }

    private getCurrentPageRecord(): PageRecord {
        return [ this._.getPagePath(), window.location.href ];
    }

    active(timestamp?: number) {
        const { first, last } = this._;
        // 记录活跃节点
        const lastTrace = last(this._trace);
        // 当前行为栈内无节点，或者最后一个节点为不活跃节点
        (!lastTrace || (lastTrace && first(lastTrace) === 'inactive')) &&
        this._trace.push([ 'active', timestamp || Date.now() ]);
    }

    inactive(timestamp?: number) {
        const { first, last } = this._;
        // 记录不活跃节点
        const lastTrace = last(this._trace);
        // 当前行为栈内最后一个节点为活跃节点
        lastTrace && first(lastTrace) === 'active' &&
        this._trace.push([ 'inactive', timestamp || Date.now() ]);
    }

    treat() {

        const { last } = this._;
        // 当前新路由
        const [ newPath, newUrl ] = this.getCurrentPageRecord();
        // 上一个路由
        const [ oldPath, oldUrl ] = last(this._pageRecord);

        // 路由发生变化但是并没有发生跳转（pathname 相同）
        if (newPath === oldPath) return null;

        // 当前页面路由存在跳转
        // 手动记录一次不活跃节点
        this.inactive();
        // 计算进入、离开、停留时长
        const [ enterTime, leaveTime, pageDwellTime ] = this.calc();

        // 更新页面访问记录
        this._pageRecord.push([ newPath, newUrl ]);
        // 访问记录维护在10个
        this._pageRecord.length > 10 && this._pageRecord.shift();

        // 手动初始化活跃节点，起始时间为上一个页面的离开时间
        this._trace = [];
        this.active(leaveTime);

        return [ enterTime, leaveTime, pageDwellTime, oldPath, oldUrl ];
    }

    /**
     * 只计算时长，不改变状态
     */
    calc() {
        const { first, last, pipe, pack } = this._;
        debugger
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