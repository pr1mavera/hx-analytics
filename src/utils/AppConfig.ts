import TYPES from '../jssdk/types';
import { inject, injectable } from 'inversify';

@injectable()
export class AppConfig implements AppConfig {
    // private container: Map<string, any> = new Map();
    private container: Obj = {
        /**
         * 行为数据上报特征值集合
         * 确定了字段名、顺序
         */
        reportType1: [
            'batchId',
            'appId',
            'appName',
            'sysId',
            'sysName',
            'origin',
            'openId',
            'clientType',
            'sysVersion',
            'ip',
            'userNetWork',
            'createTime'
        ],
        reportType2: [
            'batchId',
            'sysId',
            'pageId',
            'pageName',
            'pageUrl',
            'funcId',
            'funcName',
            'funcIntention',
            'preFuncId',
            'eventId',
            'eventName',
            'eventType',
            'eventTime',
            'createTime',
            'pageDwellTime',
            'enterTime',
            'leaveTime'
        ],
        // 三方跨域数据存贮 iframe 地址
        // insertIframeSrc: 'https://sales-dev.ihxlife.com/video/hx-analytics/jssdk/index.html'
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