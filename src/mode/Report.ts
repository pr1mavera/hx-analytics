import _ from '../utils';
import { Subscription } from 'rxjs';
import { DOMEventTarget } from 'rx';

// report 模式下所有的事件监听器注册方法，包装事件数据，触发事件消费 onTrigger
const EventListener = {
    'report-click': [
        { capture: false },
        function(config: Obj): Subscription {
            return this.events.click(config).subscribe((e: DOMEventTarget) => {
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

@_.mixins(EventListener)
export class Report implements ModeLifeCycle {
    [x: string]: any;
    readonly modeType: string = 'report';
    subs: [Subscription?];
    events: Obj;
    reportStrategy: ReportStrategy;
    constructor(events: Obj, user: UserInfo) {
        this.events = events;
        this.subs = [];

        this.reportStrategy = ReportStrategy.getInstance(user);
    }
    onEnter() {
        // 注册事件监听
        console.log(this);
        // 将自身所有 模式 + '-' 开头的事件监听器方法全部注册，并记录至 subs
        for (const key in this) {
            if (key.startsWith(this.modeType + '-')) {
                const [ config, cb ] = <[ Obj, (config: Obj) => Subscription ]>this[key];
                this.subs.push(cb.call(this, config));
            }
        }
    }
    onExit() {
        // 注销事件监听
        this.subs.length && this.subs.forEach((unsub: Subscription) => unsub.unsubscribe());
        this.subs = [];
    }
    onTrigger(data: any) {
        // 根据当前事件消费者消费数据
        this.reportStrategy.report(data)
        
    }
}

class ReportStrategy {
    [x: string]: any;
    private static instance: ReportStrategy;
    _report: (data: Obj) => void;
    get report() {
        // 根据策略（本地缓存 / 远程接口），返回对应的回调
        const strategy: string = `report2${_.firstUpperCase(this.controller)}`;
        return <(data: Obj) => void>this[strategy];
    }
    controller: 'storage' | 'server' = 'server';
    info: ClientInfo;
    public static getInstance(user: UserInfo) {
        if (!ReportStrategy.instance) {
            ReportStrategy.instance = new ReportStrategy(user);
        }
        return ReportStrategy.instance;
    }
    private constructor(user: UserInfo) {
        // 合并用户信息、设备信息
        const { name, version, browser, connType } = _.deviceInfo();
        this.info = {
            ...user,
            batchId: _.createVisitId(user.appId),
            clientType: browser,
            sysVersion: `${name} ${version}`,
            userNetWork: connType
        }
    }
    formatDatagram(data: Obj) {

    }
    report2Storage(data: Obj) {
        console.log('上报至 - 本地缓存', data);
    }
    report2Server(data: Obj) {
        console.log('上报至 - 远程服务', data);
    }
}
