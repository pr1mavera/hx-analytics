import { fromEvent, Observable } from 'rxjs';
import { sampleTime, filter } from 'rxjs/operators';

// 单个事件模块实现

// 页面生命周期事件
// onload
// onbeforeunload
// onhashchange
// onpopstate
// onvisibilitychange
// ononline
// onoffline
// onmessage

// 用户行为
// onclick
// onmousemove

// 自定义事件
// performance 页面启动性能监控报告
// tp 页面停留时长上报

// 事件注册订阅调度机制
// 各模式模块只维护当前的事件及其回调的列表，在对应生命周期中订阅及取消订阅

export const click: (config: { capture: boolean }) => Observable<Event> =
    config => fromEvent(document, 'click', { capture: config.capture });

export const mousemove: (config: { capture: boolean, debounceTime: number }) => Observable<Event> =
    config => fromEvent(document, 'mousemove', { capture: config.capture }).pipe(
        sampleTime(config.debounceTime),
        filter(e => (<HTMLElement>e.target).tagName !== 'HTML')
    );

export const load: () => Observable<Event> =
    () => fromEvent(document, 'load');

export const beforeUnload: () => Observable<Event> =
    () => fromEvent(document, 'beforeunload');

export const hashchange: () => Observable<Event> =
    () => fromEvent(document, 'hashchange');

export const popstate: () => Observable<Event> =
    () => fromEvent(document, 'popstate');

export const visibilitychange: () => Observable<Event> =
    () => fromEvent(document, 'visibilitychange');

export const online: () => Observable<Event> =
    () => fromEvent(window, 'online');

export const offline: () => Observable<Event> =
    () => fromEvent(window, 'offline');

export const message: () => Observable<Event> =
    () => fromEvent(window, 'message');
