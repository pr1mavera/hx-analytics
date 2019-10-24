import TYPES from '../jssdk/types';
import { inject, injectable } from 'inversify';

@injectable()
export class ReportStrategy implements ReportStrategy {
    [x: string]: any;

    private _: Utils;

    _report: (data: Obj) => void;
    get report() {
        // 根据策略（本地缓存 / 远程接口），返回对应的回调
        const strategy: string = `report2${this._.firstUpperCase(this.controller)}`;
        return <(data: Obj) => void>this[strategy];
    }
    
    controller = 'server';

    info: ClientInfo;

    constructor(@inject(TYPES.Utils) _: Utils) {

        this._ = _;
        const user: UserInfo = {
            appId: 'appId',
            sysId: 'sysId',
            origin: 'WE',
            openId: 'oKXX7wKQhDf0sixuV0z-gEB8Y8is'
        }
        // 合并用户信息、设备信息
        const { name, version, browser, connType } = this._.deviceInfo();

        this.info = {
            ...user,
            batchId: this._.createVisitId(user.appId),
            clientType: browser,
            sysVersion: `${name} ${version}`,
            userNetWork: connType
        }
    }
    formatDatagram(data: Obj) {

    }
    report2Storage(data: Obj) {
        console.log('上报至 - 本地缓存', data);
    }
    report2Server(data: Obj) {
        console.log('上报至 - 远程服务', data);
    }
}