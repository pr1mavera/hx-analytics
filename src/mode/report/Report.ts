import TYPES from '../../jssdk/types';
import { inject, injectable } from 'inversify';
import { Subscription } from 'rxjs';
import { loggerMiddleware, initMiddleware, clickMiddleware, preFuncIdMiddleware, pageDwellMiddleware } from './middleware';

// report 模式下所有的事件监听器注册方法，包装事件数据，触发事件消费 onTrigger
const EventListener = {
    'report-click': [
        { capture: false },
        function(config: Obj): Subscription {
            return this.events.click(config).subscribe((e: Event) => {
                // 包装事件数据，触发事件消费 onTrigger
                // this.onTrigger([ 'click', e.target ]);
                let point = this.createPoint(e.target);
                this.onTrigger([ 'click', point.pid ]);
            });
        }
    ],
    'report-change-strategy': [
        {},
        function(): Subscription {
            return this.events.netStatusChange().subscribe((type: string) => {

                console.log('Change report strategy by network fluctuation, current strategy: ', type);

                if (type === 'online') {
                    // 联网
                    // 切换当前行为数据消费策略
                    this.reportStrategy.controller = 'server';
                    // 上报上次访问未上报的行为数据
                    this.reportStrategy.resend();
                } else if (type === 'offline') {
                    // 断网
                    // 切换当前行为数据消费策略
                    this.reportStrategy.controller = 'storage';
                }

            });
        }
    ],
    'report-page-change': [
        {},
        function(): Subscription {
            // 统一单页路由变化
            return this.events.pageChange().subscribe(() => {
                // pageDwell: [ enterTime, leaveTime, pageDwellTime, pageId, pageUrl ]
                const pageDwell = this.pageTracer.treat();
                debugger
                if (!pageDwell) return;

                this.onTrigger([ 'pageDwell', ...pageDwell ]);
            });
        }
    ],
};

function mixins <T>(...list: Obj[]) {
    return function (constructor: { new (...args: any[]): T; }) {
        Object.assign(constructor.prototype, ...list);
    }
}

@mixins<Report>(EventListener)
@injectable()
export class Report implements ModeLifeCycle {
    [x: string]: any;

    // 模式类型
    readonly modeType: string = 'report';
    // 是否进入过该模式
    private _INITED: boolean = false;
    // 注入事件订阅器
    private evtSubs: EventSubscriber<Report, Subscription>;
    // 容器注入 | 单个埋点构造器
    createPoint: (origin: PointBase | EventTarget) => Point;
    // 容器注入 | 注入应用事件层
    @inject(TYPES.AppEvent) private events: AppEvent;
    // 容器注入 | 工具
    @inject(TYPES.Utils) private _: Utils;
    // 容器注入 | 应用配置相关信息
    @inject(TYPES.Conf) private conf: AppConfig;
    // 容器注入 | 注入上报策略控制器
    @inject(TYPES.ReportStrategy) private reportStrategy: ReportStrategy;
    // 容器注入 | 消息队列
    @inject(TYPES.MsgsQueue) private mq: MsgsQueue;
    // 容器注入 | 页面记录跟踪
    @inject(TYPES.PageTracer) private pageTracer: PageTracer;

    /**
     * 定义的监控事件集合
     * 默认为默认事件监控及相关中间件
     * 后续考虑将自定义事件作为系统配置信息请求过来，在该模块初始化时合并到一起，再统一使用中间件重写
     * 注意中间件的顺序：按书写顺序执行，遵循洋葱模型
     * 例如：
     * [ loggerMiddleware, clickMiddleware, preFuncIdMiddleware ]
     * logger -> click -> preFuncId -> onTrigger(next) -> logger -> click -> preFuncId
     */
    reportConfigs: Obj = {
        init: {
            params: [ 'appId', 'sysId', 'openId' ],
            middlewares: [
                loggerMiddleware,
                initMiddleware
            ]
        },
        click: {
            params: [ 'funcId', 'preFuncId' ],
            middlewares: [
                loggerMiddleware,
                clickMiddleware,
                preFuncIdMiddleware
            ]
        },
        pageDwell: {
            params: [ 'enterTime', 'leaveTime', 'pageDwellTime' ],
            middlewares: [
                loggerMiddleware,
                pageDwellMiddleware
            ]
        }
    }

    constructor(
        @inject(TYPES.Point) createPoint: (origin: PointBase | EventTarget) => Point,
        @inject(TYPES.EventSubscriber) eventSubscriber: EventSubscriber<Report, Subscription>,
    ) {
        this.evtSubs = eventSubscriber.init(this);
        // 初始化单个埋点构造器
        this.createPoint = createPoint;
    }

    onEnter() {
        console.log(this);
        // MonkeyPatch
        this.bindPageTracerPatch();
        // 绑定监控事件
        this.evtSubs.subscribe();

        // 在第一次进入的时候初始化一次性相关配置
        if (!this._INITED) {
            this._INITED = true;

            window.addEventListener('pagehide', this.onExit.bind(this));

            this.mq.onload();

            // 绑定消息队列消费者
            this.mq.bindCustomer({
                // 模拟消费者，提供 notify 接口
                // 这里由于 this.reportStrategy.report 是动态获取的，因此不可用使用 bind 将 report 直接传递出去
                notify: (...rest: any[]) => this.reportStrategy.report.apply(this.reportStrategy, rest)
            });

            // 根据事件上报配置，在这旮沓挨个注册数据上报中间件
            Object.keys(this.reportConfigs).forEach((key: string) => {
                const config = this.reportConfigs[key];
                if (config.middlewares) {
                    config.rebuildWithMiddlewares = this.applyMiddlewares(config.middlewares)(this);
                }
            });
        }
    }

    onExit() {
        // 消息队列生命周期
        this.mq.onUnload();
        // 注销事件监听
        this.evtSubs.unsubscribe();
    }

    bindPageTracerPatch() {
        window.history.pushState = this._.nativeCodeEventPatch(window.history, 'pushState');
        window.history.replaceState = this._.nativeCodeEventPatch(window.history, 'replaceState');
    }

    applyMiddlewares(middlewares: Function[]) {
        return (ctx: Report) => {
            const originTrigger = ctx._onTrigger.bind(ctx);
            // chains: ((next: Function) => (...opt: any[]) => Obj)[]
            const chains = middlewares.map((middleware: Function) => middleware(ctx));

            return ctx._.compose(...chains)(originTrigger);
        }
    }

    /**
     * 重写数据上报触发入口
     */
    get onTrigger() {
        return (reportOptList: any[]) => {

            // 参数不合法
            if (reportOptList.length < 2 || typeof reportOptList[0] != 'string') {
                console.warn('Warning in reportTrigger: illegal parames', reportOptList[0]);
                return void 0;
            }

            const [ directive, ...rest ] = reportOptList;
            // 根据指令，抽取对应上报配置
            const sendConfig = this.reportConfigs[directive];

            // 找不到对应的上报配置
            if (!sendConfig) {
                console.warn('Warning in reportTrigger: illegal directive', directive);
                return void 0;
            }

            // TODO: 参数合并中间件，系统配置的自定义事件可能会使用得到
            const { params, rebuildWithMiddlewares } = sendConfig;
            // 若存在数据上报重构函数，使用重构的上报函数，否则直接调用 this._onTrigger
            return rebuildWithMiddlewares ?
                rebuildWithMiddlewares(...rest) :
                this._onTrigger(rest[0]);
        }
    }

    // 数据上报触发入口
    _onTrigger(data: Obj) {

        let extendsData: Obj = {
            pageId: this._.getPagePath(),
            pageUrl: window.location.href,
            eventTime: Date.now(),
            ...data
        };
        
        // 单条上报数据
        let reqData: Msg = {
            type: extendsData.type,
            funcId: extendsData.funcId || '-',
            pageId: extendsData.pageId || '-',
            sysId: this.conf.get('sysId') as string,
            msg: this.formatDatagram(extendsData.type, extendsData)
        };

        // 推送至消息队列
        this.mq.push(reqData);

        return reqData;
    }

    /**
     * 构造数据报 msg 字段唯一入口
     * @param type 上报类型
     * @param extendsData 单条事件上存在的数据
     */
    formatDatagram(type: 1 | 2, extendsData: Obj = {}): string {
        // 根据事件类型获取对应字段模板
        // 对模板中的内容进行映射
        return this.conf.get(`reportType${type}`).reduce((temp: string, key: string) => {
            // 映射策略：全局系统配置 -> 传入的额外配置（一般包含当前触发的埋点信息） -> 占位
            const val = this.conf.get(key) ||
                        extendsData[key] ||
                        '$' + '{' + key + '}';
            const str = `${key}=${val}`;
            return temp += '|' + str;
        }, `type=${type}`);
    }
}
