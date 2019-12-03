import TYPES from '../../jssdk/types';
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
                const repeatPoint = this.domMasker.points.filter(
                    (point: Point) => point.pid === this.domMasker.activePoint.pid
                );
                this.onTrigger({
                    tag: 'selectPoint',
                    // 若命中的埋点是已配置过的埋点，需要将配置信息一并返回给iframe父层，即返回预埋列表的点
                    point: repeatPoint.length ? repeatPoint[0] : this.domMasker.activePoint,
                    // 是否是重复设置的埋点
                    isRepeat: repeatPoint.length !== 0
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
                    // 捕捉元素与缓存活动元素不相同
                    activePoint.pid !== this.domMasker.activePoint.pid
                ) {
                    // 设置新的捕捉元素
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
    // 容器注入 | API
    @inject(TYPES.Service) private service: Service;
    // 容器注入 | 工具
    @inject(TYPES.Utils) private _: Utils;
    // 容器注入 | 应用配置相关信息
    @inject(TYPES.Conf) private conf: AppConfig;
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

    async onEnter() {

        // 绑定监控事件
        this.evtSubs.subscribe();
        // 初始化埋点交互遮罩
        !this.domMasker._INITED && this.domMasker.init();

        // setTimeout(() => {
        //     this.initPresetPoints();
        // }, 10000);
        this.initPresetPoints();

        // 单独注册父页面的重置通讯
        // 捕捉到元素之后 Setting 模式会将当前绑定的 setting- 监控事件都注销
        // 因此在不改变模式的情况下需要依靠父窗口消息推送 reset 指令来重新开启捕捉元素
        const subs = this.events.messageOf('reset').subscribe(async (msg: { data: { tag: string, points?: PointBase[] } }) => {
            // 注销事件监听
            this.evtSubs.unsubscribe();
            // 绑定监控事件
            this.evtSubs.subscribe();
            // 初始化埋点交互遮罩
            this.initPresetPoints();
        });
        this.evtSubs.on('reset', subs);

        // todo: 阻止文档滚动
    }
    onExit() {
        // 注销事件监听
        this.evtSubs.unsubscribe();
        // 单独注销
        this.evtSubs.off('reset');
        this.domMasker.activePoint = null;
        this.domMasker.points = [];
        this.domMasker.clear();
    }
    onTrigger(data: Obj) {

        const conf = this.conf.get();

        // 包装额外数据
        Object.assign(data, {
            ext: {
                appId: conf.appId,
                appName: conf.appName,
                sysId: conf.sysId,
                sysName: conf.sysName,
                pageId: this._.getPagePath()
            }
        });

        console.log('SettingLifeCycle onTrigger：', data);
        // console.log('当前的Points: ', this.domMasker.points);

        // 通知父层设置层埋点捕捉完毕
        window.parent && window.parent.postMessage(JSON.stringify(data), '*');

        // 当前已捕获到埋点，通过注销绑定的监听可保持埋点蒙板状态
        // 注销绑定的监听
        this.evtSubs.unsubscribe();
    }

    async initPresetPoints() {
        // 调接口获取当前页预设埋点信息
        const points = await this.getPresetPoints();
        // 每次绑定预设埋点信息时，都重新缓存并初始化 缓存canvas
        points.length && this.domMasker.preset(points.map((point: Obj) => ({ ...point, pid: point.funcId })));
        // 手动重置 主绘制canvas
        this.domMasker.reset();
    }

    // 请求服务获取对应页面的已埋的埋点配置
    async getPresetPoints() {
        const rules = {
            pageId: this._.getPagePath(),
            appName: this.conf.get('appName'),
            sysName: this.conf.get('sysName'),
            pageSize: -1
        };
        // 这里的埋点版本需要从 iframe 的 父页面 上获取，字段名为 dots_v，每次都获取，即可在配置平台动态修改版本
        // 拆分 query 字符串
        const parentsQueryStr = document.referrer.split('?')[1];
        const version = this._.splitQuery(parentsQueryStr).dots_v;
        version && Object.assign(rules, { version });
        console.log('======= queryStr =======', parentsQueryStr);
        console.log('======= version =======', version);
        console.log('======= rules =======', rules);

        const [ err, res ] = await this._.errorCaptured(this.service.getPresetPointsAPI, null, rules);

        if (err) {
            console.warn(`[hx-analytics] Warn in getPresetPointsAPI: `, err);
            return [];
        }

        return <PointBase[]>res;
    }
}
