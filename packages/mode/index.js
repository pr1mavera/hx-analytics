export * from './Setting';
export * from './Report';
export class EventBinding {
    subscribe(obj) {
        debugger;
        for (const key in obj) {
            if (/e-.+/g.test(key)) {
                const [config, cb] = obj[key];
                this.subs.push(cb.call(this, config));
            }
        }
        // Object.keys(obj).forEach(key => {
        //     if (/e-.+/g.test(key)) {
        //         const [ config, cb ] = obj[key];
        //         this.subs.push(cb.call(this, config));
        //     }
        // })
    }
    unSubscribe() {
        this.subs.length && this.subs.forEach((unsub) => unsub.unsubscribe());
        this.subs = [];
    }
}
