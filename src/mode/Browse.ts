export class Browse implements ModeLifeCycle<Browse> {
    readonly modeType: string = 'browse';
    subs: [any?];
    events: Obj;
    constructor(events?: Obj) {}
    onEnter() {}
    onExit() {}
    onTrigger() {
        console.log('点吧~老弟嗷~我浏览模式啥也不会干的~');
    }
};
