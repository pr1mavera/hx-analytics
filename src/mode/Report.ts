import TYPES from '../jssdk/types';
import { inject, injectable } from 'inversify';
import { Subscription } from 'rxjs';

// report 模式下所有的事件监听器注册方法，包装事件数据，触发事件消费 onTrigger
const EventListener = {
    'report-click': [
        { capture: false },
        function(config: Obj): Subscription {
            return this.events.click(config).subscribe((e: Event) => {
                // 包装事件数据，触发事件消费 onTrigger
                this.onTrigger([ 'click', e.target ]);
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
    // 单个埋点构造器
    createPoint: (origin: PointBase | EventTarget) => Point;
    // 注入应用事件层
    @inject(TYPES.AppEvent) private events: AppEvent;
    // 容器注入 | 工具
    @inject(TYPES.Utils) private _: Utils;
    // 容器注入 | 应用配置相关信息
    @inject(TYPES.Conf) private conf: AppConfig;
    // 注入上报策略控制器
    private reportStrategy: ReportStrategy;
    // 消息队列
    private mq: MsgsQueue;

    constructor(
        @inject(TYPES.Point) createPoint: (origin: PointBase | EventTarget) => Point,
        @inject(TYPES.EventSubscriber) eventSubscriber: EventSubscriber<Report, Subscription>,
        @inject(TYPES.ReportStrategy) reportStrategy: ReportStrategy,
        @inject(TYPES.MsgsQueue) mq: MsgsQueue
    ) {
        // this.events = events;
        this.evtSubs = eventSubscriber.init(this);
        // 初始化单个埋点构造器
        this.createPoint = createPoint;
        // 上报策略控制器
        this.reportStrategy = reportStrategy;
        // 消息队列
        this.mq = mq;
        this.mq.bindCustomer({
            // 模拟消费者，提供 notify 接口
            // 这里由于 this.reportStrategy.report 是动态获取的，因此不可用使用 bind 将 report 直接传递出去
            notify: (...rest: any[]) => this.reportStrategy.report.apply(this.reportStrategy, rest)
        });
    }

    onEnter() {
        // 注册事件监听
        console.log(this);
        // 绑定监控事件
        this.evtSubs.subscribe();
        // 在第一次进入的时候推送系统加载事件
        if (!this._INITED) {
            this._INITED = true;

            // 检查最后一次行为数据是否已消费完全，若未消费完全则将其合并至本地缓存
            // const customData = this._.windowData.get('customData');
            // customData && !customData._consumed && this.reportStrategy.report2Storage([ customData ]);
            // 上报访问记录
            this.onSystemLoaded();
            // 上报上次访问未上报的行为数据
            // this.reportStrategy.resend();
        }
    }

    onSystemLoaded() {

        const reqData: Msg = {
            type: 1,
            funcId: '',
            pageId: '',
            sysId: this.conf.get('sysId') as string,
            msg: this.formatDatagram(1)
        }
        // this.reportStrategy.report([ reqData ]);
        this.mq.push(reqData);
    }
    onExit() {
        // 注销事件监听
        this.evtSubs.unsubscribe();
    }
    onTrigger(data: [ string , EventTarget ]) {

        const [ eventType, target ] = data;

        // 格式化埋点信息
        let point = this.createPoint(target);
        // 上一次行为事件唯一标识
        // 首次打开窗口加载页面的时候 get('customData') 为空字符串，需要错误处理
        const lastCustomData = this._.windowData.get('lastCustomData');
        const preFuncId = lastCustomData && lastCustomData.funcId || '-';

        // 埋点相关信息
        let extendsData = {
            pageId: location.pathname,
            pageUrl: location.href,
            funcId: point.pid,
            preFuncId,
            eventId: eventType,
            eventTime: Date.now()
        };
        
        // 单条上报数据
        let reqData: Msg = {
            type: 2,
            funcId: extendsData.funcId,
            pageId: extendsData.pageId,
            sysId: this.conf.get('sysId') as string,
            msg: this.formatDatagram(2, extendsData)
        };

        // 缓存进 window.name ，在下一次上报时使用
        this._.windowData.set('lastCustomData', reqData);

        // 根据当前事件消费者消费数据
        // this.reportStrategy.report([ reqData ]);
        this.mq.push(reqData);
    }

    formatDatagram(type: 1 | 2, extendsData: Obj = {}): string {
        // 根据事件类型获取对应字段模板
        // 对模板中的内容进行映射
        return this.conf.get(`reportType${type}`).reduce((temp: string, key: string) => {
            // 映射策略：全局系统配置 -> 传入的额外配置（一般包含当前触发的埋点信息） -> 占位
            const val = this.conf.get(key) ||
                        extendsData[key] ||
                        '$' + '{' + key + '}';
            const str = `${key}=${val}`
            return temp += '|' + str;
        }, `type=${type}`);
    }
}
