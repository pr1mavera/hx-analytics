import _ from '../utils';
import { Subscription } from 'rxjs';

// report 模式下所有的事件监听器注册方法，包装事件数据，触发事件消费 onTrigger
const EventListener = {
    'setting-click': [
        { capture: true },
        function (config: Obj): Subscription {
            return this.events.click(config).subscribe((e: Event) => {
                e.stopPropagation();
                // 包装事件数据，触发事件消费 onTrigger;
                this.onTrigger({
                    tag: 'selectPoint',
                    point: this.domMasker.activePoint,
                    // 是否是重复设置的埋点
                    isRepeat: this.domMasker.points.filter(
                        (point: Point) => point.pid === this.domMasker.activePoint.pid
                    ).length !== 0
                } as Obj);
            });
        }
    ],
    'setting-mousemove': [
        { capture: false, debounceTime: 200 },
        function (config: Obj): Subscription {
            return this.events.mousemove(config).subscribe((e: MouseEvent) => {
                // 包装事件数据，触发事件消费 onTrigger
                const activePoint = new Point(e.target);
                if (activePoint !== this.domMasker.activePoint) {
                    // 获取的元素为新的捕捉元素
                    this.domMasker.activePoint = activePoint;
                    // 渲染遮罩层
                    this.domMasker.reset();
                    this.domMasker.render(this.domMasker.canvas.getContext('2d'), new Point(e.target));
                }
            });
        }
    ],
    'setting-preset': [
        {},
        function (): Subscription {
            return this.events.messageOf('preset').subscribe(
                (msg: { data: { tag: string, points: PointBase[] } }) => {
                    this.domMasker.preset(msg.data.points);
                }
            );
        }
    ],
};

@_.mixins(EventListener)
export class Setting implements ModeLifeCycle {
    [x: string]: any;
    readonly modeType: string = 'setting';
    subs: [Subscription?];
    events: Obj;
    domMasker: DomMasker;
    constructor(events: Obj, user: UserInfo) {
        this.events = events;
        this.subs = [];

        // 单独注册父页面的重置通讯
        // 捕捉到元素之后 Setting 模式会将当前绑定的 setting- 监控事件都注销
        // 因此在不改变模式的情况下需要依靠父窗口消息推送 reset 指令来重新开启捕捉元素
        this.events.messageOf('reset').subscribe((msg: { data: { tag: string, points?: PointBase[] } }) => {
            // 绑定监控事件
            this.subscribe();
            // 若此处将新的预设埋点传过来了，则更新，否则使用原来的
            msg.data.points && this.domMasker.preset(msg.data.points);
            // 重置埋点蒙板
            this.domMasker.reset();
        });
    }
    subscribe() {
        // 注册事件监听
        // 将自身所有 模式 + '-' 开头的事件监听器方法全部注册，并记录至 subs
        for (const key in this) {
            if (key.startsWith(this.modeType + '-')) {
                const [config, cb] = <[Obj, (config: Obj) => Subscription]>this[key];
                this.subs.push(cb.call(this, config));
            }
        }
    }
    unsubscribe() {
        // 注销事件监听
        this.subs.length && this.subs.forEach((unsub: Subscription) => unsub.unsubscribe());
        this.subs = [];
    }
    onEnter(points: PointBase[] = []) {

        // 绑定监控事件
        this.subscribe();
        // 初始化埋点交互遮罩
        this.domMasker = DomMasker.getInstance.call(points);

        // 每次绑定预设埋点信息时，都重新缓存并初始化 缓存canvas
        points && this.domMasker.preset(points);
        // 手动重置 主绘制canvas
        this.domMasker.reset();

        // todo: 阻止文档滚动
    }
    onExit() {
        // 注销事件监听
        this.unsubscribe();
        this.domMasker.clear();
    }
    onTrigger(data: any) {
        console.log('SettingLifeCycle onTrigger：', data);
        // console.log('当前的Points: ', this.domMasker.points);

        // 当前已捕获到埋点，通过注销绑定的监听可保持埋点蒙板状态
        // 注销绑定的监听
        this.unsubscribe();
        // 通知父层设置层埋点捕捉完毕
        window.parent && window.parent.postMessage(data, '*');
    }
}

const customCanvas: (width: number, height: number, color?: string) => HTMLCanvasElement
    = (width, height, color = 'rgba(77, 131, 202, 0.5)') => {
        let canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '9999';
        canvas.style.pointerEvents = 'none';

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.font = '18px serif';
        ctx.textBaseline = 'ideographic';

        return canvas;
    };

class DomMasker implements DomMasker {
    private static instance: DomMasker;
    static w: number = window.innerWidth;
    static h: number = window.innerHeight;
    // _active: boolean;
    // 预设埋点
    points: Point[];
    // 当前圈选埋点
    activePoint: Point;

    // 主绘制canvas
    canvas: HTMLCanvasElement;
    // 缓存canvas
    tempCanvas: HTMLCanvasElement;

    public static getInstance(points: PointBase[] = []) {
        if (!DomMasker.instance) {
            DomMasker.instance = new DomMasker(points);
        }
        return DomMasker.instance;
    }
    private constructor(points: PointBase[]) {
        // points: [{ pid:'span.corner.top!document.querySelector()!sysId!pageId' }]

        // 初始化 主绘制canvas / 缓存canvas
        this.canvas = customCanvas(DomMasker.w, DomMasker.h);
        this.tempCanvas = customCanvas(DomMasker.w, DomMasker.h, 'rgba(200, 100, 50, 0.6)');

        // 插入页面根节点
        document.body.appendChild(this.canvas);
    }
    // 将预设埋点信息标准化，并将信息对应的绘制到 缓存canvas 上
    // 注意：此API不会造成页面 主绘制canvas 的绘制
    // 幂等操作
    preset(points: PointBase[]) {
        console.log('this.tempCanvas：', this);
        this.tempCanvas.getContext('2d').clearRect(0, 0, DomMasker.w, DomMasker.h);
        this.points = points.map((p: PointBase) => new Point(p));

        const ctx = this.tempCanvas.getContext('2d');
        // 绘制预设埋点蒙版，保存在内存中
        this.points.forEach((point: Point) => {
            this.render(ctx, point);
        });
    }
    clear() {
        this.canvas.getContext('2d').clearRect(0, 0, DomMasker.w, DomMasker.h);
    }
    reset() {
        this.clear();
        if (this.points.length) {
            // 将缓存信息当做背景绘制到 主绘制canvas
            const ctx = this.canvas.getContext('2d');
            ctx.drawImage(this.tempCanvas, 0, 0);
        }
    }
    render(ctx: CanvasRenderingContext2D, point: Point) {
        const { tag, rect: [x, y, width, height] } = point;
        ctx.fillRect(x, y, width, height);
        ctx.fillText(tag, x, y);
        // ctx.save();
        // ctx.strokeStyle = '#fff';
        // ctx.lineWidth = 1;
        // ctx.strokeText(tag, x, y);
        // ctx.restore();
    }
}

class Point implements Point {
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
