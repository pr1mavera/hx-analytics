import TYPES from '../jssdk/types';
import { inject, injectable } from 'inversify';

@injectable()
export class AppConfig implements AppConfig {

    // 容器注入 | 工具
    @inject(TYPES.Utils) private _: Utils;

    private container: Obj = {
        /**
         * 行为数据上报特征值集合
         * 确定了字段名、顺序
         */
        reportType1: [
            'batchId', /*           访问流水号 */
            'appId', /*             应用Id */
            'appName', /*           应用名称 */
            'sysId', /*             系统Id */
            'sysName', /*           系统名称 */
            'origin', /*            客户来源 */
            'openId', /*            openId */
            'clientType', /*        客户端设备型号 */
            'sysVersion', /*        客户端系统版本 */
            'ip', /*                客户端IP */
            'userNetWork', /*       客户端网络状态 */
            'createTime' /*         服务端事件时间 */
        ],
        reportType2: [
            'batchId', /*           访问流水号 */
            'sysId', /*             系统Id */
            'pageId', /*            页面Path */
            'pageName', /*          页面名称 */
            'pageUrl', /*           完整页面地址 */
            'funcId', /*            埋点Id */
            'funcName', /*          埋点名称 */
            'funcIntention', /*     埋点意向 */
            'preFuncId', /*         上一个事件埋点Id */
            'eventId', /*           事件Id（原生事件为事件的 eventType，自定义事件为自定义事件id，在配置界面设置） */
            'eventName', /*         事件名称 */
            'eventType', /*         事件类型 */
            'eventTime', /*         客户端事件时间 */
            'createTime', /*        服务端事件时间 */
            'pageDwellTime', /*     页面停留时长 */
            'enterTime', /*         客户端页面进入时间 */
            'leaveTime' /*          客户端页面离开时间 */
        ],
        // 三方跨域数据存贮 iframe 地址
        // insertIframeSrc: 'https://sales-dev.ihxlife.com/video/hx-analytics/jssdk/index.html'
    };

    set(key: string, data: Obj) {
        this.container[key] = data;
    }
    get(key: string = '') {
        return key ?
                this.container[key] :
                JSON.parse(JSON.stringify(this.container));
    }
    merge(data: Obj) {
        this.container = { ...this.container, ...data };
    }
    // getSelf() {
    //     return JSON.parse(JSON.stringify(this.container));
    // }
}