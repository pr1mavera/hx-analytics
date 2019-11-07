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

    _report: (data: Obj, ignoreErr?: 'ignoreErr') => Promise<boolean>;
    get report() {
        // 根据策略（本地缓存 / 远程接口），返回对应的回调
        const strategy: string = `report2${this._.firstUpperCase(this.controller)}`;

        return async (data: Obj[], ignoreErr?: 'ignoreErr') => {

            /**
             * 重构步骤：
             * 1. 将消费的最后一条行为数据缓存进 window.name，下一行为数据需要用到
             * 2. 根据策略，消费数据
             * 3. 消费完成，若消费成功，将缓存的最后一条行为数据标识为已消费
             * 
             * 暂时这样写，后期根据复杂度，有可能增加中间件机制，将该步骤以中间件的形式注入进来
             */

            // 最后一次行为事件（type == 2），缓存进 window.name ，在下一次上报时使用
            const lastData = data[data.length - 1];
            lastData.type == 2 && this._.windowData.set('customData', lastData);

            // 原消费
            const customState = await this[strategy](data, ignoreErr);

            // 获取当前的缓存消费数据
            const customData = this._.windowData.get('customData');
            // 缓存的当前行为数据与请求成功的最后一条数据相同，则更新缓存的当前行为数据的已消费标识
            if (
                customState && /*                           消费成功 */
                customData && customData.funcId && /*       window.name 存在 customData，且有完整数据 */
                customData.funcId === lastData.funcId /*    当前消费的最后一次行为事件与 customData 缓存的数据一致 */
            ) {
                customData._consumed = true;
                this._.windowData.set('customData', customData);
            }
            // alert(`我能走到存完缓存这儿来，现在的 window.name: ${JSON.stringify({customState, customData})}`);
            return customData;
        }
    }

    report2Storage(data: Obj[]) {
        let cache = this._.LocStorage.get(this.storageKey);
        // 合并之前的缓存
        cache = cache ? <Array<Obj>>cache.concat(data) : data;
        console.log('report to Storage: ', cache);

        try {
            // 存入本地
            this._.LocStorage.set(this.storageKey, cache);
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
                return this.report2Storage(data);
            }
            return false;
        } else {
            console.log('report to Server: ', data);
            // alert(`report2Server 我咋还发成功了呢？？：${JSON.stringify(data, null, 2)}`);
            return true;
        }
    }
    async resend() {
        const cache = this._.LocStorage.get(this.storageKey);
        // alert(`resend: 上从的缓存数据：${JSON.stringify(cache, null, 2)}`);
        // 若存在缓存
        cache &&
        // 则尝试重新发送
        await this.report(cache, 'ignoreErr') &&
        // 若成功将数据重新发送，则将缓存数据清空
        this._.LocStorage.remove(this.storageKey);
    }
}