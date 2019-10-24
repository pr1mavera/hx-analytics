import { injectable } from 'inversify';

@injectable()
export class Browse implements ModeLifeCycle {
    readonly modeType: string = 'browse';
    events: Obj;
    onEnter() {}
    onExit() {}
    onTrigger() {
        console.log('点吧~老弟嗷~我浏览模式啥也不会干的~');
    }
}
