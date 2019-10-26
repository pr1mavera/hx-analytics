import { injectable } from 'inversify';

@injectable()
export class AppConfig implements AppConfig {
    // private container: Map<string, any> = new Map();
    private container: Obj = {
        reportType1: [ 'batchId', 'appId', 'appName', 'sysId', 'sysName', 'origin', 'openId', 'clientType', 'sysVersion', 'ip', 'userNetWork', 'createTime', ],
        reportType2: [ 'batchId', 'sysId', 'pageId', 'pageName', 'functId', 'funcName', 'funcIntention', 'eventId', 'eventName', 'eventType', 'eventTime', 'createTime', 'pageDwellTime', 'enterTime', 'leaveTime', ]
    };
    set(data: Obj) {
        this.container = { ...this.container, ...data };
    }
    get(key: string) {
        return this.container[key];
    }
    getSelf() {
        return JSON.parse(JSON.stringify(this.container));
    }
}