import TYPES from '../jssdk/types';
import { inject, injectable } from 'inversify';

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
                const activePoint = this.createPoint(e.target);

                if (
                    // 当前为第一次绘制，活动元素还未初始化
                    !this.domMasker.activePoint ||
                    // 捕捉元素与缓存活动元素相同
                    activePoint.pid !== this.domMasker.activePoint.pid
                ) {
                    // 获取的元素为新的捕捉元素
                    this.domMasker.activePoint = activePoint;
                    // 渲染基础遮罩层
                    this.domMasker.reset();
                    // 渲染当前活动埋点
                    this.domMasker.render(this.domMasker.canvas.getContext('2d'), activePoint);
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

function mixins <T>(...list: Obj[]) {
    return function (constructor: { new (...args: any[]): T; }) {
        Object.assign(constructor.prototype, ...list);
    }
}

@mixins<Setting>(EventListener)
@injectable()
export class Setting implements ModeLifeCycle {
    [x: string]: any;
    readonly modeType: string = 'setting';
    // 单个埋点构造器
    createPoint: (origin: PointBase | EventTarget) => Point;
    // 注入配置遮罩模块
    @inject(TYPES.DomMasker) private domMasker: DomMasker;
    // 注入应用事件层
    @inject(TYPES.AppEvent) private events: AppEvent;
    // 容器注入 | 工具
    @inject(TYPES.Utils) private _: Utils;
    // 注入事件订阅器
    private evtSubs: EventSubscriber<Setting, Subscription>;

    constructor(
        @inject(TYPES.Point) createPoint: (origin: PointBase | EventTarget) => Point,
        @inject(TYPES.EventSubscriber) eventSubscriber: EventSubscriber<Setting, Subscription>
    ) {
        this.evtSubs = eventSubscriber.init(this);
        // 初始化单个埋点构造器
        this.createPoint = createPoint;
        // this.events = events;
        // this.evtSubs = new EventSubscriber<Setting, Subscription>(this);
    }
    onEnter(points: PointBase[] = []) {

        // 绑定监控事件
        this.evtSubs.subscribe();
        // 初始化埋点交互遮罩
        !this.domMasker._INITED && this.domMasker.init();

        // 每次绑定预设埋点信息时，都重新缓存并初始化 缓存canvas
        points && this.domMasker.preset(points);
        // 手动重置 主绘制canvas
        this.domMasker.reset();

        // 单独注册父页面的重置通讯
        // 捕捉到元素之后 Setting 模式会将当前绑定的 setting- 监控事件都注销
        // 因此在不改变模式的情况下需要依靠父窗口消息推送 reset 指令来重新开启捕捉元素
        this.evtSubs.on('reset', this.events.messageOf('reset').subscribe((msg: { data: { tag: string, points?: PointBase[] } }) => {
            // 绑定监控事件
            this.evtSubs.subscribe();
            // 若此处将新的预设埋点传过来了，则更新，否则使用原来的
            msg.data.points && this.domMasker.preset(msg.data.points);
            // 重置埋点蒙板
            this.domMasker.reset();
        }));

        // todo: 阻止文档滚动
    }
    onExit() {
        // 注销事件监听
        this.evtSubs.unsubscribe();
        // 单独注销
        this.evtSubs.off('reset');
        this.domMasker.clear();
    }
    onTrigger(data: any) {
        console.log('SettingLifeCycle onTrigger：', data);
        // console.log('当前的Points: ', this.domMasker.points);

        // 当前已捕获到埋点，通过注销绑定的监听可保持埋点蒙板状态
        // 注销绑定的监听
        this.evtSubs.unsubscribe();
        // 通知父层设置层埋点捕捉完毕
        this._.inIframe() && window.parent.postMessage(data, '*');
    }
}
