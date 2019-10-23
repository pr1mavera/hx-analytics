import _ from './';

export class Point implements Point {
    pid: string;
    tag: string;
    rect: number[];
    constructor(origin: PointBase | EventTarget) {
        if (origin instanceof EventTarget) {
            this.createByEvent(origin);
        } else {
            this.createByPointBase(origin);
        }
    }
    createByPointBase(origin: PointBase) {
        this.pid = origin.pid;
        const elem = _.getElemByPid(origin.pid);
        this.tag = '<' + elem.tagName.toLowerCase() + '>';
        // [ x, y, w, h ]
        this.rect = _.getElemClientRect(elem);
    }
    createByEvent(origin: EventTarget) {
        this.pid = _.getElemPid('sysId', 'pageId', <HTMLElement>origin);
        this.tag = '<' + (<HTMLElement>origin).tagName.toLowerCase() + '>';
        // [ x, y, w, h ]
        this.rect = _.getElemClientRect(<Element>origin);
    }
}