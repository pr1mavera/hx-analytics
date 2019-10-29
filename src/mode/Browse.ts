import { injectable } from 'inversify';

@injectable()
export class Browse implements ModeLifeCycle {
    readonly modeType: string = 'browse';
    events: Obj;
    onEnter() {}
    onExit() {}
    onTrigger() {
        console.warn('No data will upload with browse mode!');
    }
}
