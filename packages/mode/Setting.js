var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import _ from '../utils';
// report 模式下所有的事件监听器注册方法，包装事件数据，触发事件消费 onTrigger
const EventListener = {
    'setting-click': [
        { capture: true },
        function (config) {
            return this.events.click(config).subscribe((e) => {
                e.stopPropagation();
                // 包装事件数据，触发事件消费 onTrigger;
                this.onTrigger({
                    tag: 'selectPoint',
                    point: this.domMasker.activePoint,
                    // 是否是重复设置的埋点
                    isRepeat: this.domMasker.points.filter((point) => point.pid === this.domMasker.activePoint.pid).length !== 0
                });
            });
        }
    ],
    'setting-mousemove': [
        { capture: false, debounceTime: 200 },
        function (config) {
            return this.events.mousemove(config).subscribe((e) => {
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
        function () {
            return this.events.messageOf('preset').subscribe((msg) => {
                this.domMasker.preset(msg.data.points);
            });
        }
    ],
};
let Setting = class Setting {
    constructor(events) {
        this.modeType = 'setting';
        this.events = events;
        this.subs = [];
        // 单独注册父页面的重置通讯
        // 捕捉到元素之后 Setting 模式会将当前绑定的 setting- 监控事件都注销
        // 因此在不改变模式的情况下需要依靠父窗口消息推送 reset 指令来重新开启捕捉元素
        this.events.messageOf('reset').subscribe((msg) => {
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
            if (key.startsWith(this.modeType)) {
                const [config, cb] = this[key];
                this.subs.push(cb.call(this, config));
            }
        }
    }
    unsubscribe() {
        // 注销事件监听
        this.subs.length && this.subs.forEach((unsub) => unsub.unsubscribe());
        this.subs = [];
    }
    onEnter(points = []) {
        // 绑定监控事件
        this.subscribe();
        // 初始化埋点交互遮罩
        this.domMasker = new DomMasker(points);
        // todo: 阻止文档滚动
    }
    onExit() {
        // 注销事件监听
        this.unsubscribe();
        this.domMasker.clear();
    }
    onTrigger(data) {
        console.log('SettingLifeCycle onTrigger：', data);
        // console.log('当前的Points: ', this.domMasker.points);
        // 当前已捕获到埋点，通过注销绑定的监听可保持埋点蒙板状态
        // 注销绑定的监听
        this.unsubscribe();
        // 通知父层设置层埋点捕捉完毕
        window.parent && window.parent.postMessage(data, '*');
    }
};
Setting = __decorate([
    _.mixins(EventListener),
    __metadata("design:paramtypes", [Object])
], Setting);
export { Setting };
;
const customCanvas = (width, height, color = 'rgba(77, 131, 202, 0.5)') => {
    let canvas = document.createElement('canvas');
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
class DomMasker {
    constructor(points = []) {
        // points: [{ pid:'span.corner.top!document.querySelector()!sysId!pageId' }]
        if (!DomMasker.instance) {
            // 初始化 主绘制canvas / 缓存canvas
            this.canvas = customCanvas(DomMasker.w, DomMasker.h);
            this.tempCanvas = customCanvas(DomMasker.w, DomMasker.h, 'rgba(200, 100, 50, 0.6)');
            // 插入页面根节点
            document.body.appendChild(this.canvas);
            DomMasker.instance = this;
        }
        // 每次绑定预设埋点信息时，都重新缓存并初始化 缓存canvas
        this.preset(points);
        // 手动重置 主绘制canvas
        this.reset();
        // 返回单例
        return DomMasker.instance;
    }
    // 将预设埋点信息标准化，并将信息对应的绘制到 缓存canvas 上
    // 注意：此API不会造成页面 主绘制canvas 的绘制
    // 幂等操作
    preset(points) {
        this.tempCanvas.getContext('2d').clearRect(0, 0, DomMasker.w, DomMasker.h);
        this.points = points.map((p) => new Point(p));
        const ctx = this.tempCanvas.getContext('2d');
        // 绘制预设埋点蒙版，保存在内存中
        this.points.forEach((point) => {
            this.render(ctx, point);
        });
    }
    clear() {
        this.canvas.getContext('2d').clearRect(0, 0, DomMasker.w, DomMasker.h);
    }
    ;
    reset() {
        this.clear();
        if (this.points.length) {
            // 将缓存信息当做背景绘制到 主绘制canvas
            const ctx = this.canvas.getContext('2d');
            ctx.drawImage(this.tempCanvas, 0, 0);
        }
    }
    ;
    render(ctx, point) {
        const { tag, rect: [x, y, width, height] } = point;
        ctx.fillRect(x, y, width, height);
        ctx.fillText(tag, x, y);
        // ctx.save();
        // ctx.strokeStyle = '#fff';
        // ctx.lineWidth = 1;
        // ctx.strokeText(tag, x, y);
        // ctx.restore();
    }
    ;
}
DomMasker.w = window.innerWidth;
DomMasker.h = window.innerHeight;
class Point {
    constructor(origin) {
        if (origin instanceof EventTarget) {
            this.createByEvent(origin);
        }
        else {
            this.createByPointBase(origin);
        }
    }
    createByPointBase(origin) {
        this.pid = origin.pid;
        const elem = _.getElemByPid(origin.pid);
        this.tag = '<' + elem.tagName.toLowerCase() + '>';
        // [ x, y, w, h ]
        this.rect = _.getElemClientRect(elem);
    }
    createByEvent(origin) {
        this.pid = _.getElemPid('sysId', 'pageId', origin);
        this.tag = '<' + origin.tagName.toLowerCase() + '>';
        // [ x, y, w, h ]
        this.rect = _.getElemClientRect(origin);
    }
}
