// import './events';

import { fromEvent, merge } from 'rxjs';
import { sampleTime, filter, map } from 'rxjs/operators';

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

    routeChange() {
        return merge(this.hashchange(), this.popstate(), this.pushState(), this.replaceState());
    },

    pageVisible() {
        return this.visibilitychange().pipe(
            filter(() => document.visibilityState === 'visible')
        )
    },

    pageHidden() {
        return this.visibilitychange().pipe(
            filter(() => document.visibilityState === 'hidden')
        )
    }
}
