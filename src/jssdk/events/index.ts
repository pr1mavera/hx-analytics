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
    click: config => fromEvent(window, 'click', { capture: config.capture }),

    mousemove: config => fromEvent(window, 'mousemove', { capture: config.capture }).pipe(
        sampleTime(config.debounceTime),
        filter(e => (<HTMLElement>e.target).tagName !== 'HTML')
    ),

    load: () => fromEvent(window, 'load'),

    beforeUnload: () => fromEvent(window, 'beforeunload'),

    pageShow: () => fromEvent(window, 'pageshow'),

    pageHide: () => fromEvent(window, 'pagehide'),

    hashchange: () => fromEvent(window, 'hashchange').pipe(
        map((e: HashChangeEvent) => ([ 'hashchange', e.newURL ]))
    ),

    popstate: () => fromEvent(window, 'popstate').pipe(
        map(() => ([ 'popstate', location.href ]))
    ),

    pushState: () => fromEvent(window, 'pushstate').pipe(
        map(() => ([ 'pushstate', location.href ]))
    ),

    replaceState: () => fromEvent(window, 'replacestate').pipe(
        map(() => ([ 'replacestate', location.href ]))
    ),

    visibilitychange: () => fromEvent(window, 'visibilitychange'),

    online: () => fromEvent(window, 'online'),

    offline: () => fromEvent(window, 'offline'),

    message: () => fromEvent(window, 'message'),

    messageOf(tag) {
        return this.message().pipe(
            filter((msg: MessageEvent) => <'setting' | 'browse'>(msg.data.tag) === tag)
        );
    },

    netStatusChange() {
        return merge(this.online(), this.offline()).pipe(
            map((e: Event) => e.type)
        );
    },

    pageChange() {
        return merge(this.hashchange(), this.popstate(), this.pushState(), this.replaceState());
        // const addEvent = handle => {
        //     handle
        // }
        // return {
        //     subscribe: (handle) => {
        //         window.addEventListener('')
        //     }
        // }
    }
}
