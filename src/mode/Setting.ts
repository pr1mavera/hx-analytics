import _ from '../utils';
import { DomMasker } from '../utils/DomMasker';
import { Point } from '../utils/Point';

import { Subscription } from 'rxjs';
import { EventSubscriber } from '../utils/EventSubscriber';

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
    evtSubs: EventSubscriber<Setting, Subscription>;
    events: Obj;
    domMasker: DomMasker;
    constructor(events: Obj, user: UserInfo) {
        this.events = events;
        this.evtSubs = new EventSubscriber<Setting, Subscription>(this);
    }
    onEnter(points: PointBase[] = []) {

        // 绑定监控事件
        this.evtSubs.subscribe();
        // 初始化埋点交互遮罩
        this.domMasker = DomMasker.getInstance.call(points);

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
        window.parent && window.parent.postMessage(data, '*');
    }
}
