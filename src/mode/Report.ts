import TYPES from '../jssdk/types';
import container from '../jssdk/inversify.config';
import { inject, injectable } from 'inversify';

// import { _ } from '../utils';
import { Subscription } from 'rxjs';

// report 模式下所有的事件监听器注册方法，包装事件数据，触发事件消费 onTrigger
const EventListener = {
    'report-click': [
        { capture: false },
        function(config: Obj): Subscription {
            return this.events.click(config).subscribe((e: Event) => {
                // 包装事件数据，触发事件消费 onTrigger
                this.onTrigger(e);
            });
        }
    ],
    'report-change-strategy': [
        {},
        function(): Subscription {
            return this.events.netStatusChange().subscribe((type: string) => {
                const strategy = type === 'online' ? 'server' : 'storage'
                console.log('网络变化，切换当前行为数据消费策略: ', strategy)
                // 网络状态变化，切换当前行为数据消费策略
                this.reportStrategy.controller = strategy;
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
    // 注入事件订阅器
    private evtSubs: EventSubscriber<Report, Subscription>;
    // 注入上报策略控制器
    @inject(TYPES.ReportStrategy) private reportStrategy: ReportStrategy;
    // 注入应用事件层
    @inject(TYPES.AppEvent) private events: AppEvent;

    constructor(
        @inject(TYPES.EventSubscriber) eventSubscriber: EventSubscriber<Report, Subscription>
    ) {
        // this.events = events;
        this.evtSubs = eventSubscriber.init(this);
    }
    onEnter() {
        // 注册事件监听
        console.log(this);
        // 绑定监控事件
        this.evtSubs.subscribe();
    }
    onExit() {
        // 注销事件监听
        this.evtSubs.unsubscribe();
    }
    onTrigger(data: any) {
        // 根据当前事件消费者消费数据
        this.reportStrategy.report(data)
    }
}
