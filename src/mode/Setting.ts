import _ from '../utils';
import { Subscription } from 'rxjs';
import { DOMEventTarget } from 'rx';

// report 模式下所有的事件监听器注册方法，包装事件数据，触发事件消费 onTrigger
const EventListener = {
    'setting-click': [
        { capture: false },
        function(config: Obj): Subscription {
            return this.events.click(config).subscribe((e: DOMEventTarget) => {
                // 包装事件数据，触发事件消费 onTrigger
                this.onTrigger(e);
            });
        }
    ],
    'setting-reset': [
        {},
        function(): Subscription {
            return this.events.messageOf('reset').subscribe(() => {
                this.domMasker.reset();
            });
        }
    ],
    'setting-preset': [
        {},
        function(): Subscription {
            return this.events.messageOf('preset').subscribe((msg: { data: Obj }) => {
                this.domMasker.preset(<PointBase[]>msg.data.presetPoints);
            });
        }
    ]
};

@_.mixins(EventListener)
export class Setting implements ModeLifeCycle<Setting> {
    [x: string]: any;
    readonly modeType: string = 'setting';
    subs: [Subscription?];
    events: Obj;
    DomMasker: DomMasker;
    constructor(events: Obj) {
        this.events = events;
        this.subs = [];

        // 注册通讯
    }
    onEnter() {
        // 切换当前事件消费者为Setting
        // 订阅该模式下的事件消费信息
        // 注册事件监听
        // 将自身所有 模式 + '-' 开头的事件监听器方法全部注册，并记录至 subs
        for (const key in this) {
            if (key.startsWith(this.modeType)) {
                const [ config, cb ] = <[ Obj, (config: Obj) => Subscription ]>this[key];
                this.subs.push(cb.call(this, config));
            }
        }

        // 初始化埋点交互遮罩
        this.DomMasker = new DomMasker();

        // todo: 阻止文档滚动
    }
    onExit() {
        // 注销事件监听
        this.subs.length && this.subs.forEach((unsub: Subscription) => unsub.unsubscribe());
        this.subs = [];
        this.DomMasker.clear();
    }
    onTrigger(data: Obj) {
        console.log('SettingLifeCycle onTrigger');
        window.parent.postMessage(data, '*');
    }
};

class DomMasker implements DomMasker {
    static instance: DomMasker;
    // _active: boolean;
    // 预设埋点
    points: Point[];
    // 当前圈选埋点
    activePoint: Point;

    // 主绘制canvas
    canvas: CustomCanvas;
    // 缓存canvas
    tempCanvas: CustomCanvas;

    constructor(points: PointBase[] = []) {

        if (!DomMasker.instance) {
            // 初始化 主绘制canvas / 缓存canvas
            const w = window.innerWidth;
            const h = window.innerHeight
            this.canvas = new CustomCanvas(w, h);
            this.tempCanvas = new CustomCanvas(w, h);
            // 插入页面根节点
            document.body.appendChild(this.canvas);

            DomMasker.instance = this;
        }

        // 每次绑定预设埋点信息时，都重新缓存并初始化 缓存canvas
        this.preset(points);
        // 将缓存信息当做背景绘制到 主绘制canvas
        const ctx = this.canvas.getContext('2d');
        ctx.drawImage(this.tempCanvas, 0, 0);

        // 返回单例
        return DomMasker.instance;
    }
    // 将预设埋点信息标准化，并将信息对应的绘制到 缓存canvas 上
    // 幂等操作
    preset(points: PointBase[]) {
        this.tempCanvas.clear();
        this.points = points.map((p: PointBase) => new Point(p.pid));

        const ctx = this.tempCanvas.getContext('2d');
        // 绘制预设埋点蒙版，保存在内存中
        this.points.forEach((point: Point) => {
            this.render(ctx, point.getRect());
        });
    }
    clear() {
        this.canvas.clear()
    };
    reset() {
        
    };
    onCatch() {

    };
    render(ctx: CanvasRenderingContext2D, rect: Rect) {

    };
}

class Point implements Point {
    pid: string;
    constructor(pid: string) {
        this.pid = pid;
    }
    getRect(): Rect {
        const wid = this.pid.split('!')[0];
        const {
            clientWidth,    // 元素宽
            clientHeight,   // 元素高
            scrollHeight,   // 纵向滚动
            scrollWidth,    // 横向滚动
            offsetTop,      // 距离文档顶部高度
            offsetLeft      // 距离文档左边高度
        } = _.getElem(wid);
        // [ x, y, w, h ]
        return [ offsetLeft - scrollWidth, offsetTop - scrollHeight, clientWidth, clientHeight ];
    }
    draw(ctx: CanvasRenderingContext2D) {

    }
}

class CustomCanvas extends HTMLCanvasElement implements CustomCanvas {
    w: number;
    h: number;
    constructor(w: number, h: number) {
        super();
        this.width = this.w = w;
        this.height = this.h = h;
        this.style.position = 'absolute';
        this.style.top = '0';
        this.style.left = '0';
        this.style.zIndex = '9999';
        this.style.pointerEvents = 'none';
        return this;
    }
    clear(): void {
        this.getContext('2d').clearRect(0, 0, this.w, this.h);
    }
}
