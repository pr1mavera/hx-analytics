import TYPES from '../jssdk/types';
import { inject, injectable } from 'inversify';

@injectable()
export class Point implements Point {
    pid: string;
    tag: string;
    rect: number[];

    private _: Utils;

    constructor(_: Utils) {
        this._ = _;
    }

    create(origin: PointBase | EventTarget) {

        if (origin instanceof EventTarget) {
            this.createByEvent(origin);
        } else {
            this.createByPointBase(origin);
        }
        return this;
    }
    private createByPointBase(origin: PointBase) {
        this.pid = origin.pid;
        const elem = this._.getElemByPid(origin.pid);
        this.tag = '<' + elem.tagName.toLowerCase() + '>';
        // [ x, y, w, h ]
        this.rect = this._.getElemClientRect(elem);
    }
    private createByEvent(origin: EventTarget) {
        this.pid = this._.getElemPid('sysId', 'pageId', <HTMLElement>origin);
        this.tag = '<' + (<HTMLElement>origin).tagName.toLowerCase() + '>';
        // [ x, y, w, h ]
        this.rect = this._.getElemClientRect(<Element>origin);
    }
}