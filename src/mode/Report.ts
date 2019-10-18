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
};

@_.mixins(EventListener)
export class Report implements ModeLifeCycle<Report> {
    [x: string]: any;
    readonly modeType: string = 'report';
    subs: [Subscription?];
    events: Obj;
    constructor(events: Obj) {
        this.events = events;
        this.subs = [];
    }
    onEnter() {
        // 注册事件监听
        console.log(this);
        // 将自身所有 模式 + '-' 开头的事件监听器方法全部注册，并记录至 subs
        for (const key in this) {
            if (key.startsWith(this.modeType)) {
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

    onTrigger(data: Obj) {
        // 根据当前事件消费者消费数据
        console.log('ReportLifeCycle onTrigger: ', data);
    }
    formatDatagram() {

    }
};
