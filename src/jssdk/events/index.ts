import { fromEvent, merge } from 'rxjs';
import { sampleTime, filter, map } from 'rxjs/operators';

// const DomEvent = (target: HTMLElement, eventName: string, options: EventListenerOptions) => {
    
// }

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

export const AppEvent: AppEvent = {
    click: config => fromEvent(document, 'click', { capture: config.capture }),

    mousemove: config => fromEvent(document, 'mousemove', { capture: config.capture }).pipe(
        sampleTime(config.debounceTime),
        filter(e => (<HTMLElement>e.target).tagName !== 'HTML')
    ),

    load: () => fromEvent(document, 'load'),

    beforeUnload: () => fromEvent(document, 'beforeunload'),

    pageShow: () => fromEvent(window, 'pageshow'),

    pageHide: () => fromEvent(window, 'pagehide'),

    hashchange: () => fromEvent(document, 'hashchange'),

    popstate: () => fromEvent(document, 'popstate'),

    visibilitychange: () => fromEvent(document, 'visibilitychange'),

    online: () => fromEvent(window, 'online'),

    offline: () => fromEvent(window, 'offline'),

    message: () => fromEvent(window, 'message'),

    messageOf(tag) {
        return this.message().pipe(
            filter((msg: MessageEvent) => <'setting' | 'browse'>(msg.data.tag) === tag)
        )
    },

    netStatusChange() {
        return merge(this.online(), this.offline()).pipe(
            map((e: Event) => e.type)
        )
    }
}
