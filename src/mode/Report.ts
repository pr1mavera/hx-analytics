import _ from '../utils';
import { Subscription } from 'rxjs';
import { DOMEventTarget } from 'rx';

const config = {
    'e-click': [ { capture: false }, function(config: Obj): Subscription {
        debugger;
        return this.events.click(config).subscribe((e: DOMEventTarget) => {
            console.log('上报模式的点击：', e);
        })
    } ],
};

const eventBinding = {
    subs: [Subscription],
    subscribe(obj: Obj): void {
        console.log(obj)
        for (const key in obj) {
            if (/e-.+/g.test(key)) {
                const [ config, cb ] = obj[key];
                this.subs.push(cb.call(this, config));
            }
        }
    },
    unSubscribe(): void {
        this.subs.length && this.subs.forEach((unsub: Subscription) => unsub.unsubscribe());
        this.subs = [];
    }
}

@_.mixins(eventBinding, config)
export class Report implements ModeLifeCycle<Report> {
    [x: string]: any;
    readonly modeType: string = 'report';
    events: object;
    constructor(events: Obj) {
        // super();
        this.events = events;
    }
    onEnter(this: Report) {
        // 切换当前事件消费者为report
        this.subscribe(this);
    }
    onExit() {
        this.unSubscribe();
    }
    onTrigger() {
        console.log('ReportLifeCycle onTrigger');
    }
    formatDatagram() {

    }
};
