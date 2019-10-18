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
        { capture: false },
        function (config) {
            return this.events.click(config).subscribe((e) => {
                // 包装事件数据，触发事件消费 onTrigger
                this.onTrigger(e);
            });
        }
    ],
    'setting-reset': [
        {},
        function () {
            return this.events.messageOf('reset').subscribe(() => {
                this.domMasker.reset();
            });
        }
    ],
    'setting-preset': [
        {},
        function () {
            return this.events.messageOf('preset').subscribe((msg) => {
                this.domMasker.preset(msg.data.presetPoints);
            });
        }
    ]
};
let Setting = class Setting {
    constructor(events) {
        this.modeType = 'setting';
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
                const [config, cb] = this[key];
                this.subs.push(cb.call(this, config));
            }
        }
        // 初始化埋点交互遮罩
        this.DomMasker = new DomMasker();
        // todo: 阻止文档滚动
    }
    onExit() {
        // 注销事件监听
        this.subs.length && this.subs.forEach((unsub) => unsub.unsubscribe());
        this.subs = [];
        this.DomMasker.clear();
    }
    onTrigger(data) {
        console.log('SettingLifeCycle onTrigger');
        window.parent.postMessage(data, '*');
    }
};
Setting = __decorate([
    _.mixins(EventListener),
    __metadata("design:paramtypes", [Object])
], Setting);
export { Setting };
;
class DomMasker {
    constructor(points = []) {
        if (!DomMasker.instance) {
            // 初始化 主绘制canvas / 缓存canvas
            const w = window.innerWidth;
            const h = window.innerHeight;
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
    preset(points) {
        this.tempCanvas.clear();
        this.points = points.map((p) => new Point(p.pid));
        const ctx = this.tempCanvas.getContext('2d');
        // 绘制预设埋点蒙版，保存在内存中
        this.points.forEach((point) => {
            this.render(ctx, point.getRect());
        });
    }
    clear() {
        this.canvas.clear();
    }
    ;
    reset() {
    }
    ;
    onCatch() {
    }
    ;
    render(ctx, rect) {
    }
    ;
}
class Point {
    constructor(pid) {
        this.pid = pid;
    }
    getRect() {
        const wid = this.pid.split('!')[0];
        const { clientWidth, // 元素宽
        clientHeight, // 元素高
        scrollHeight, // 纵向滚动
        scrollWidth, // 横向滚动
        offsetTop, // 距离文档顶部高度
        offsetLeft // 距离文档左边高度
         } = _.getElem(wid);
        // [ x, y, w, h ]
        return [offsetLeft - scrollWidth, offsetTop - scrollHeight, clientWidth, clientHeight];
    }
    draw(ctx) {
    }
}
class CustomCanvas extends HTMLCanvasElement {
    constructor(w, h) {
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
    clear() {
        this.getContext('2d').clearRect(0, 0, this.w, this.h);
    }
}
