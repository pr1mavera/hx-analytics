import TYPES from '../jssdk/types';
import { inject, injectable } from 'inversify';

@injectable()
export class ReportStrategy implements ReportStrategy {
    [x: string]: any;

    // 容器注入 | 工具
    @inject(TYPES.Utils) private _: Utils;
    // 容器注入 | API
    @inject(TYPES.Service) private service: Service;
    // 缓存的 key
    storageKey: string = 'UserBehaviorCache';
    // 策略控制器（默认上报至RPC）
    controller: 'server' | 'Storage' = 'server';

    _report: (data: Obj) => void;
    get report() {
        // 根据策略（本地缓存 / 远程接口），返回对应的回调
        const strategy: string = `report2${this._.firstUpperCase(this.controller)}`;
        return <(data: Obj) => Boolean | null>this[strategy];
    }

    report2Storage(data: Obj[]) {
        let cache = this._.LocStorage.get(this.storageKey);
        // 合并之前的缓存
        cache = cache ? <Array<Obj>>cache.concat(data) : data;
        console.log('report to Storage: ', cache);

        try {
            // 存入本地
            this._.LocStorage.set(this.storageKey, cache);

            const customData = this._.windowName.get();
            // 缓存的当前行为数据与请求成功的最后一条数据相同，则更新缓存的当前行为数据的已消费标识
            if (data[data.length - 1].funcId === customData.funcId) {
                customData._consumed = true;
                this._.windowName.set(customData);
            }

            return true;
        } catch (error) {
            const eStr = JSON.stringify(error);
            error = null;
            console.warn(`Warn in report2Storage: ${eStr}`);
            return false;
        }
    }
    async report2Server(data: Obj[], ignoreErr?: 'ignoreErr') {
        // 日志上报
        const [ err ] = await this._.errorCaptured(this.service.reportAPI, null, { msgs: data });

        if (err) {
            console.warn(
                'Warn in report2Server: ',
                err
            );
            // 是否将未成功上报的数据缓存进本地，若指定为 'ignoreErr' 则不缓存
            if (!ignoreErr) {
                console.warn('this report data will be cached into LocalStorage, and will be resend on next time you visit this website ! ');
                this.report2Storage(data);
            }
            return false;
        } else {
            console.log('report to Server: ', data);

            const customData = this._.windowName.get();
            // 缓存的当前行为数据与请求成功的最后一条数据相同，则更新缓存的当前行为数据的已消费标识
            if (data[data.length - 1].funcId === customData.funcId) {
                customData._consumed = true;
                this._.windowName.set(customData);
            }

            return true;
        }
    }
    async resend() {
        const cache = this._.LocStorage.get(this.storageKey);
        // 若存在缓存
        cache &&
        // 则尝试重新发送
        await this.report2Server(cache, 'ignoreErr') &&
        // 若成功将数据重新发送，则将缓存数据清空
        this._.LocStorage.remove(this.storageKey);
    }
}