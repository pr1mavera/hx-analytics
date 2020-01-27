import TYPES from '../../jssdk/types';
import { injectable, inject } from 'inversify';
import { Unsubscribable } from 'rxjs';

@injectable()
export class Browse implements ModeLifeCycle {

    readonly modeType: string = 'browse';

    subs: Unsubscribable;

    // 注入应用事件层
    @inject(TYPES.AppEvent) private events: AppEvent;
    // 容器注入 | 应用配置相关信息
    @inject(TYPES.Conf) private conf: AppConfig;
    // 容器注入 | 工具
    @inject(TYPES.Utils) private _: Utils;

    onEnter() {
        this.subs = this.events.messageOf('requireConfig').subscribe(() => {
            this.onTrigger({ tag: 'selectPage' } as Obj);
        });
    }
    onExit() {
        this.subs.unsubscribe();
    }
    onTrigger(data: Obj) {

        const conf = this.conf.get();

        // 包装额外数据
        Object.assign(data, {
            ext: {
                appId: conf.appId,
                appName: conf.appName,
                sysId: conf.sysId,
                sysName: conf.sysName,
                pageId: this._.normalizePageId(this.conf.get('publicPath') as string)
            }
        });

        console.log('BrowseLifeCycle onTrigger：', data);

        // 通知父层
        window.parent && window.parent.postMessage(JSON.stringify(data), '*');
    }
}
