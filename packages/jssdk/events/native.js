import { fromEvent } from 'rxjs';
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
export const click = config => fromEvent(document, 'click', { capture: config.capture });
export const mousemove = config => fromEvent(document, 'mousemove', { capture: config.capture }).pipe(sampleTime(config.debounceTime), filter(e => e.target.tagName !== 'HTML'));
export const load = () => fromEvent(document, 'load');
export const beforeUnload = () => fromEvent(document, 'beforeunload');
export const hashchange = () => fromEvent(document, 'hashchange');
export const popstate = () => fromEvent(document, 'popstate');
export const visibilitychange = () => fromEvent(document, 'visibilitychange');
export const online = () => fromEvent(document, 'online');
export const offline = () => fromEvent(document, 'offline');
export const message = () => fromEvent(window, 'message');
