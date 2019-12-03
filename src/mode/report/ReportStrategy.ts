import TYPES from '../../jssdk/types';
import { inject, injectable } from 'inversify';

@injectable()
export class ReportStrategy implements ReportStrategy {
    [x: string]: any;

    // 容器注入 | API
    private service: Service;
    // 容器注入 | 工具
    private _: Utils;
    // 缓存的 key
    storageKey: string;
    // 策略控制器（默认上报至RPC）
    controller: 'server' | 'storage' = 'server';

    _report: (data: Msg[], opt: Obj) => Promise<boolean> | boolean;
    get report() {
        // 根据策略（本地缓存 / 远程接口）
        const strategy: string = `report2${this._.firstUpperCase(this.controller)}`;
        // 返回对应的回调
        return (data: Msg[], opt: Obj) => this[strategy](data, opt);
    }

    private safeReportBeaconAPI(data: FormData): [ any, boolean ] {
        console.log('我是 Beacon API');
        try {
            const res = this.service.reportBeaconAPI(data);
            return [ res ? null : 'Something wrong in reportBeaconAPI', res ];
        } catch (error) {
            return [ error, false ];
        }
    }

    private async safeReportAPI(data: FormData): Promise<any[]> {
        console.log('我是 fetch API');
        return await this._.errorCaptured(this.service.reportAPI, null, data);
    }

    constructor(
        @inject(TYPES.Utils) _: Utils,
        @inject(TYPES.Service) service: Service
    ) {
        this._ = _;
        this.service = service;
        this.storageKey = this._.createCacheKey();
    }

    // // 接收消息队列的消费通知
    // notify(data: Msg[]) {
    //     return this.report(data);
    // }

    report2Storage(data: Msg[]) {
        let cache = this._.LocStorage.get(this.storageKey);
        // 合并之前的缓存
        cache = cache ? <Array<Msg>>cache.concat(data) : data;
        console.log('report to Storage: ', cache);

        try {
            // 存入本地
            this._.LocStorage.set(this.storageKey, cache);
            return true;
        } catch (error) {
            const eStr = JSON.stringify(error);
            error = null;
            console.warn(`[hx-analytics] Warn in report2Storage: ${eStr}`);
            return false;
        }
    }

    report2Server(data: Msg[], opt: Obj = {}) {

        console.log('report to Server: ', data);
        // 数据包装
        let formData = new FormData();
        formData.append('msgs', JSON.stringify(data));
        // 选项
        const { ignoreErr, useBeacon } = opt;
        // 处理发送结果
        const handleRes = (res: any[]) => {
            const [ err ] = res;
            if (err) {
                console.warn(
                    '[hx-analytics] Warn in report2Server: ',
                    err
                );
                // 是否将未成功上报的数据缓存进本地，若指定为 'ignoreErr' 则不缓存
                if (!ignoreErr) {
                    console.warn('[hx-analytics] this report data will be cached into LocalStorage, and will be resend on next time you visit this website ! ');
                    return this.report2Storage(data);
                }
                // 传递消费结果
                return false;
            } else {
                // 传递消费结果
                return true;
            }
        }

        // 日志上报
        if (useBeacon) {
            // 使用 sendBeacon API
            const res = this.safeReportBeaconAPI(formData);
            return handleRes(res);
        } else {
            // 使用 fetch API
            return this.safeReportAPI(formData).then(res => handleRes(res));
        }
    }

    async resend() {
        const cache = this._.LocStorage.get(this.storageKey);
        // alert(`resend: 上从的缓存数据：${JSON.stringify(cache, null, 2)}`);
        // 若存在缓存
        cache &&
        // 则尝试重新发送
        await this.report(cache, { ignoreErr: true }) &&
        // 若成功将数据重新发送，则将缓存数据清空
        this._.LocStorage.remove(this.storageKey);
    }
}