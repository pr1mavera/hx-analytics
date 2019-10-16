var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import _ from '../utils';
import { Subscription } from 'rxjs';
const config = {
    'e-click': [{ capture: false }, function (config) {
            debugger;
            return this.events.click(config).subscribe((e) => {
                console.log('上报模式的点击：', e);
            });
        }],
};
const eventBinding = {
    subs: [Subscription],
    subscribe(obj) {
        console.log(obj);
        for (const key in obj) {
            if (/e-.+/g.test(key)) {
                const [config, cb] = obj[key];
                this.subs.push(cb.call(this, config));
            }
        }
        // Object.keys(obj).forEach(key => {
        //     if (/e-.+/g.test(key)) {
        //         const [ config, cb ] = obj[key];
        //         this.subs.push(cb.call(this, config));
        //     }
        // })
    },
    unSubscribe() {
        this.subs.length && this.subs.forEach((unsub) => unsub.unsubscribe());
        this.subs = [];
    }
};
let Report = class Report {
    constructor(events) {
        this.modeType = 'report';
        // super();
        this.events = events;
    }
    onEnter() {
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
Report = __decorate([
    _.mixins(eventBinding, config)
], Report);
export { Report };
;
