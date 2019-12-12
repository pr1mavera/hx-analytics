import TYPES from '../../jssdk/types';
import { inject, injectable } from 'inversify';
import { Subscription } from 'rxjs';
import * as middlewares from './middleware';

// report 模式下所有的事件监听器注册方法，包装事件数据，触发事件消费 onTrigger
const EventListener = {
    'report-click': [
        // 此处需要在捕获阶段抓取点击事件
        // 因为如果是在冒泡阶段抓取，则此时原生点击已经执行，单页面场景页面已经跳转，将导致事件上报不准确
        { capture: true },
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
    'report-route-change': [
        {},
        function(): Subscription {
            // 统一单页路由变化
            return this.events.routeChange().subscribe(() => {
                // 检查当前是否存在跳转
                if (!this.pageTracer.isRouteChange()) return;
                // pageDwell: [ enterTime, leaveTime, pageDwellTime, pageId, pageUrl ]
                const pageDwell = this.pageTracer.treat();
                // 重置当前页 pageTracer
                this.pageTracer.init();
                // 生产页面停留时长数据
                this.onTrigger([ 'pageDwell', ...pageDwell ]);
                // 生产新页面进入数据
                this.onTrigger([ 'pageEnter', this._.getPageId(), window.location.href ]);
            });
        }
    ],
    'report-page-visible': [
        {},
        function(): Subscription {
            // 页面切至前台状态变化
            return this.events.pageVisible().subscribe(() => {

                /**
                 * 页面停留数据重载
                 */
                // 添加页面活跃节点
                this.pageTracer.active();
                // 清空页面休眠时缓存的上报数据
                const key = this.pageTracer._cacheKey;
                key && (this._.LocStorage.remove(key), this.pageTracer._cacheKey = '');

                /**
                 * 消息队列数据重载
                 */
                this.mq.onLoad();
            });
        }
    ],
    'report-page-hidden': [
        {},
        function(): Subscription {
            // 页面切至后台状态变化
            return this.events.pageHidden().subscribe(() => {

                /**
                 * 页面停留数据处理
                 * 
                 * 保存一份停留时长数据至缓存
                 * 防止移动设备直接关闭应用导致数据丢失（将索引保存在页面追踪实例上）
                 * 若移动设备切至后台后直接杀掉应用 -> 将在下次访问页面时上报
                 * 若移动设备切至后台后再次回到应用 -> 缓存会被清空
                 * 
                 * PS: iOS 暂时存在问题，切至后台不会触发 visibilitychange ，哦吼
                 */
                const pageDwell = this.pageTracer.treat();
                // 生成一份上报数据，只生成不上报
                const reportData: Msg = this.onTrigger([ 'pageDwell', ...pageDwell, { packgeMsgOnly: true } ]);
                // 缓存这份上报数据
                this._.LocStorage.set(this.pageTracer._cacheKey = this._.createCacheKey(), [ reportData ]);

                /**
                 * 消息队列数据处理
                 */
                this.mq.onUnload();
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
     * 监控事件上报中间件集合
     * 后续考虑将自定义事件作为系统配置信息请求过来，在该模块初始化时合并到一起，再统一使用中间件重写
     * 注意中间件的顺序：按书写顺序执行，遵循洋葱模型
     * 例如：
     * [ loggerMiddleware, clickMiddleware, preFuncIdMiddleware ]
     * 执行顺序：logger -> click -> preFuncId -> onTrigger(next) -> preFuncId -> click -> logger
     */
    reportConfigs: Obj = {
        init: {
            params: [ 'appId', 'sysId', 'openId' ],
            middlewares: [
                middlewares.loggerMiddleware,
                middlewares.initMiddleware
            ]
        },
        click: {
            params: [ 'eventId', 'funcId', 'preFuncId' ],
            middlewares: [
                middlewares.loggerMiddleware,
                middlewares.clickMiddleware,
                middlewares.preFuncIdMiddleware
            ]
        },
        pageDwell: {
            params: [ 'eventId', 'enterTime', 'leaveTime', 'enterTime', 'leaveTime', 'pageDwellTime' ],
            middlewares: [
                middlewares.loggerMiddleware,
                middlewares.pageDwellMiddleware
            ]
        },
        pageEnter: {
            params: [ 'eventId', 'pageId', 'pageUrl', 'enterTime' ],
            middlewares: [
                middlewares.loggerMiddleware,
                middlewares.pageEnterMiddleware,
                middlewares.preFuncIdMiddleware,
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
        // 绑定监控事件
        this.evtSubs.subscribe();

        // 在第一次进入的时候初始化一次性相关配置
        if (!this._INITED) {
            this._INITED = true;

            // 这里使用原生的事件监控，实测使用Rxjs监控 pagehide 好像叭太行
            // 原因不详（好像是因为进入了Rxjs的调度中心成了异步的？？）
            window.addEventListener('pagehide', this.onExit.bind(this), true);

            this.mq.onLoad();

            // 绑定消息队列消费者
            this.mq.bindCustomer({
                // 模拟消费者，提供 notify 接口
                // 这里由于 this.reportStrategy.report 是动态获取的，因此不可用使用 bind 将 report 直接传递出去
                notify: (...rest: any[]) => this.reportStrategy.report.apply(this.reportStrategy, rest)
            });

            // 根据事件上报配置，在这旮沓挨个注册数据上报中间件
            Object.keys(this.reportConfigs).forEach((key: string) => {
                const config = this.reportConfigs[key];
                if (config.middlewares && config.middlewares.length) {
                    config.triggerWithMiddlewares = this.applyMiddlewares(config.middlewares)(this);
                }
            });

            this.onTrigger([ 'pageEnter', this._.getPageId(), window.location.href ]);
        }
    }

    onExit() {

        /**
         * 页面停留数据边界情况处理
         */
        // pageDwell: [ enterTime, leaveTime, pageDwellTime, pageId, pageUrl ]
        const pageDwell = this.pageTracer.treat();
        // 重置当前页 pageTracer
        this.pageTracer.init();
        // 生成一份上报数据
        this.onTrigger([ 'pageDwell', ...pageDwell ]);

        /**
         * 消息队列生命周期
         */
        this.mq.onUnload();

        /**
         * 注销事件监听
         */
        this.evtSubs.unsubscribe();
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
                console.warn('[hx-analytics] Warning in reportTrigger: illegal parames', reportOptList[0]);
                return void 0;
            }

            const [ directive, ...rest ] = reportOptList;
            // 根据指令，抽取对应上报配置
            const sendConfig = this.reportConfigs[directive];

            // 找不到对应的上报配置
            if (!sendConfig) {
                console.warn('[hx-analytics] Warning in reportTrigger: illegal directive', directive);
                return void 0;
            }

            // TODO: 参数合并中间件，系统配置的自定义事件可能会使用得到
            const { params, triggerWithMiddlewares } = sendConfig;
            // 若存在数据上报重构函数，使用重构的上报函数，否则直接调用 this._onTrigger
            return triggerWithMiddlewares ?
                triggerWithMiddlewares(...rest) :
                this._onTrigger(rest[0]);
        }
    }

    // 数据上报触发入口
    _onTrigger(data: Obj) {

        let extendsData: Obj = {
            pageId: this._.getPageId(),
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
            isSysEvt: extendsData.isSysEvt || '-', // type 为 2 时，标识是否是系统事件，系统事件不需要按配置信息清洗
            msg: this.formatDatagram(extendsData.type, extendsData)
        };

        // 推送至消息队列
        !extendsData.packgeMsgOnly && this.mq.push(reqData);

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
