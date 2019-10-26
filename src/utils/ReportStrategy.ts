import TYPES from '../jssdk/types';
import { inject, injectable } from 'inversify';

@injectable()
export class ReportStrategy implements ReportStrategy {
    [x: string]: any;

    // 容器注入 | 工具
    @inject(TYPES.Utils) private _: Utils;
    // 容器注入 | API
    @inject(TYPES.Service) private service: Service;

    storageKey: string = 'UserBehaviorCache';

    _report: (data: Obj) => void;
    get report() {
        // 根据策略（本地缓存 / 远程接口），返回对应的回调
        const strategy: string = `report2${this._.firstUpperCase(this.controller)}`;
        return <(data: Obj) => void>this[strategy];
    }
    
    // 策略控制器
    controller: 'server' | 'Storage' = 'server';

    report2Storage(data: Obj[]) {
        let cache = this._.LocStorage.get(this.storageKey);
        cache && (cache = <Array<Obj>>cache.concat(data));
        this._.LocStorage.set(this.storageKey, cache);
        console.log('上报至 - 本地缓存', cache);
    }
    async report2Server(data: Obj[]) {
        // 日志上报
        const [ err ] = await this._.errorCaptured(this.service.reportAPI, null, { msgs: data });

        if (err) {
            console.warn(
                'Warn in report2Server: ',
                err,
                '\n',
                'this report data will be cached into LocalStorage, and will be resend on next time you visit this website ! '
            );
            this.report2Storage(data);
        } else {
            console.log('上报至 - 远程服务', data);
        }
    }
    resend() {
        const cache = this._.LocStorage.get(this.storageKey);
        this.report2Server(cache);
    }
}