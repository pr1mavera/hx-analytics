import { injectable } from 'inversify';

@injectable()
export class Browse implements ModeLifeCycle {
    readonly modeType: string = 'browse';
    onEnter() {}
    onExit() {}
    onTrigger(data: Obj) {
        console.warn('No data will upload with browse mode!');
    }
}
