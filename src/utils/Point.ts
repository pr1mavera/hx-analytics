import TYPES from '../jssdk/types';
import { inject, injectable } from 'inversify';

@injectable()
export class Point implements Point {
    pid: string;
    tag: string;
    rect: number[];

    private _: Utils;
    private conf: AppConfig;

    constructor(_: Utils, conf: AppConfig) {
        this._ = _;
        this.conf = conf;
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
        const { pid, ...rest } = origin;
        this.pid = origin.pid;
        const elem = this._.getElemByPid(this.pid);
        if (!elem) {
            // 未能通过 pid 找到对应 dom节点（）
            console.warn(
                `Warn in Point.create: Can't find element with pid: `,
                this.pid,
                '\n',
                `please check out the element's fingerprint or location.pathname!`
            );
            this.tag = 'unknow';
            this.rect = [ 0, 0, 0, 0 ];
        } else {
            this.tag = '<' + elem.tagName.toLowerCase() + '>';
            // [ x, y, w, h ]
            this.rect = this._.getElemClientRect(elem);
            // 将若存在额外内容，即为已配置埋点，同样绑定在该对象上
            Object.assign(this, rest);
        }
    }
    private createByEvent(origin: EventTarget) {
        const sysId = this.conf.get('sysId');
        this.pid = this._.getElemPid(sysId, location.pathname, <HTMLElement>origin);
        this.tag = '<' + (<HTMLElement>origin).tagName.toLowerCase() + '>';
        // [ x, y, w, h ]
        this.rect = this._.getElemClientRect(<Element>origin);
    }
}