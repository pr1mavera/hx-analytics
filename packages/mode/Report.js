var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import _ from '../utils';
// report 模式下所有的事件监听器注册方法，包装事件数据，触发事件消费 onTrigger
const EventListener = {
    'report-click': [
        { capture: false },
        function (config) {
            return this.events.click(config).subscribe((e) => {
                // 包装事件数据，触发事件消费 onTrigger
                this.onTrigger(e);
            });
        }
    ],
};
let Report = class Report {
    constructor(events) {
        this.modeType = 'report';
        this.events = events;
        this.subs = [];
    }
    onEnter() {
        // 注册事件监听
        console.log(this);
        // 将自身所有 模式 + '-' 开头的事件监听器方法全部注册，并记录至 subs
        for (const key in this) {
            if (key.startsWith(this.modeType)) {
                const [config, cb] = this[key];
                this.subs.push(cb.call(this, config));
            }
        }
    }
    onExit() {
        // 注销事件监听
        this.subs.length && this.subs.forEach((unsub) => unsub.unsubscribe());
        this.subs = [];
    }
    onTrigger(data) {
        // 根据当前事件消费者消费数据
        console.log('ReportLifeCycle onTrigger: ', data);
    }
    formatDatagram() {
    }
};
Report = __decorate([
    _.mixins(EventListener),
    __metadata("design:paramtypes", [Object])
], Report);
export { Report };
;
