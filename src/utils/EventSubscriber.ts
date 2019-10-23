export class EventSubscriber<T extends { [x: string]: any, modeType: string }, S extends { unsubscribe(): void }> implements EventSubscriber<T, S> {
    [x: string]: any;
    ctx: T;
    subs: S[] = [];
    constructor(ctx: T) {
        this.ctx = ctx;
    }
    subscribe() {
        // 统一注册事件监听
        // 将 ctx 所有 模式 + '-' 开头的事件监听器方法全部注册，并记录至 subs
        for (const key in this.ctx) {
            if (key.startsWith(this.ctx.modeType + '-')) {
                const [config, cb] = <[Obj, (config: Obj) => S]>this.ctx[key];
                this.subs.push(cb.call(this.ctx, config));
            }
        }
    }
    unsubscribe() {
        // 统一注销事件监听
        this.subs.length && this.subs.forEach((unsub: S) => unsub.unsubscribe());
        this.subs = [];
    }
    // 单独注册自定义事件
    on(event: string, sub: S) {
        this[event] = sub;
    }
    // 单独注销自定义事件
    off(event: string) {
        // 存在即注销
        this[event] &&
        this[event].unsubscribe &&
        this[event].unsubscribe();
    
        this[event] = undefined;
    }
}