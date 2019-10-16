export class Setting {
    constructor(events) {
        this.modeType = 'setting';
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
}
;
