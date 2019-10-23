import _ from './';

export class ReportStrategy implements ReportStrategy {
    [x: string]: any;
    private static instance: ReportStrategy;

    _report: (data: Obj) => void;
    get report() {
        // 根据策略（本地缓存 / 远程接口），返回对应的回调
        const strategy: string = `report2${_.firstUpperCase(this.controller)}`;
        return <(data: Obj) => void>this[strategy];
    }
    
    controller = 'server';
    info: ClientInfo;
    public static getInstance(user: UserInfo) {
        if (!ReportStrategy.instance) {
            ReportStrategy.instance = new ReportStrategy(user);
        }
        return ReportStrategy.instance;
    }
    private constructor(user: UserInfo) {
        // 合并用户信息、设备信息
        const { name, version, browser, connType } = _.deviceInfo();
        this.info = {
            ...user,
            batchId: _.createVisitId(user.appId),
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