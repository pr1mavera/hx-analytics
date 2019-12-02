import 'reflect-metadata';
import { Container } from 'inversify';
import { Subscription } from 'rxjs';
import TYPES from './types';
import {
    HXAnalytics
} from './HXAnalytics';
import { AppEvent } from './events';
import { Service } from './service';

// 浏览模式
import { Browse } from '../mode/browse/Browse';
// 上报模式
import { Report, MsgsQueue, ReportStrategy, PageTracer } from '../mode/report';
// 配置模式
import { Setting, customCanvas, DomMasker } from '../mode/setting';

// import { Utils } from '../typings/utils';
import { _, AppConfig, EventSubscriber, Point, } from '../utils';

const container = new Container();

container.bind<HXAnalytics>(TYPES.HXAnalytics).to(HXAnalytics).inSingletonScope();

// 应用事件层
container.bind<AppEvent>(TYPES.AppEvent).toConstantValue(AppEvent);
// 全局工具
container.bind<Utils>(TYPES.Utils).toConstantValue(_);
// API
container.bind<Service>(TYPES.Service).toConstantValue(Service);
// 应用配置相关信息
container.bind<AppConfig>(TYPES.Conf).to(AppConfig).inSingletonScope();

// 模式
container.bind<ModeLifeCycle>(TYPES.Browse).to(Browse);
container.bind<ModeLifeCycle>(TYPES.Setting).to(Setting);
container.bind<ModeLifeCycle>(TYPES.Report).to(Report);
// const modeContainer = {
//     browse: container.get<ModeLifeCycle>(TYPES.Browse),
//     setting: container.get<ModeLifeCycle>(TYPES.Setting),
//     report: container.get<ModeLifeCycle>(TYPES.Report)
// };
// container.bind<{ [x: string]: ModeLifeCycle }>(TYPES.ModeContainer).toConstantValue(modeContainer);

// 事件订阅器集合
container.bind<EventSubscriber<ModeLifeCycle, Subscription>>(TYPES.EventSubscriber).to(EventSubscriber);

// 上报策略（远程服务 / 本地缓存）
container.bind<ReportStrategy>(TYPES.ReportStrategy).to(ReportStrategy);
// 消息队列
container.bind<MsgsQueue>(TYPES.MsgsQueue).to(MsgsQueue);
// 页面记录跟踪
container.bind<PageTracer>(TYPES.PageTracer).to(PageTracer);

// 埋点配置相关类型
container.bind<DomMasker>(TYPES.DomMasker).to(DomMasker).inSingletonScope();
container.bind<(width: number, height: number, color?: string) => HTMLCanvasElement>(TYPES.CustomCanvas).toFunction(customCanvas);

const createPoint = (origin: PointBase | EventTarget) => new Point(_, container.get<AppConfig>(TYPES.Conf)).create(origin);
container.bind<(origin: PointBase | EventTarget) => Point>(TYPES.Point).toFunction(createPoint);

export default container;