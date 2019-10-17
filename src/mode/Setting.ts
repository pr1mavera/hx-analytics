import { Subscription } from 'rxjs';

export class Setting implements ModeLifeCycle<Setting> {
    readonly modeType: string = 'setting';
    subs: [Subscription?];
    events: Obj;
    constructor(events: Obj) {
        this.events = events;
    }
    reset() {
        // 重置选中状态
    }
    onEnter() {
        // 切换当前事件消费者为Setting
        // 订阅该模式下的事件消费信息
    }
    onCatch() {
        // 选中元素，注销当前事件订阅
    }
    onExit() {

    }
    onTrigger() {
        console.log('SettingLifeCycle onTrigger');
    }
};