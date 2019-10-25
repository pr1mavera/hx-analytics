import 'reflect-metadata';
import { Container } from 'inversify';
import { Subscription } from 'rxjs';
import TYPES from "./types";
import {
    HXAnalytics
} from './HXAnalytics';
import { AppEvent } from './events';
import {
    Browse,
    Setting,
    Report
} from '../mode';
import {
    _,
    customCanvas,
    DomMasker,
    EventSubscriber,
    Point,
    ReportStrategy
} from '../utils';

const container = new Container();

container.bind<HXAnalytics>(TYPES.HXAnalytics).to(HXAnalytics).inSingletonScope();

// 应用事件层
container.bind<AppEvent>(TYPES.AppEvent).toConstantValue(AppEvent);
// 全局工具
container.bind<Utils>(TYPES.Utils).toFunction(_);

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

// 埋点配置相关类型
container.bind<DomMasker>(TYPES.DomMasker).to(DomMasker).inSingletonScope();
container.bind<(width: number, height: number, color?: string) => HTMLCanvasElement>(TYPES.CustomCanvas).toFunction(customCanvas);

const createPoint = (origin: PointBase | EventTarget) => new Point(_).create(origin);
container.bind<(origin: PointBase | EventTarget) => Point>(TYPES.Point).toFunction(createPoint);

export default container;