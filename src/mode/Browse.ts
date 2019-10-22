export class Browse implements ModeLifeCycle {
    readonly modeType: string = 'browse';
    subs: [any?];
    events: Obj;
    constructor(event: Obj, user: UserInfo) {}
    onEnter() {}
    onExit() {}
    onTrigger() {
        console.log('点吧~老弟嗷~我浏览模式啥也不会干的~');
    }
}
