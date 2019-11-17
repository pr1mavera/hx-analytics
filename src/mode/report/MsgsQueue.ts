import TYPES from '../../jssdk/types';
import { inject, injectable } from 'inversify';

@injectable()
export class MsgsQueue implements MsgsQueue {

    queue: Array<Msg> = [];
    timer: NodeJS.Timeout | null = null;
    delay: number = 2000;
    customer: { notify: Function } = null;

    // 容器注入 | 工具
    private _: Utils;
    // 注入应用事件层
    private events: AppEvent;

    private onload() {

        /**
         * 载入时，比较缓存数据，重载消息队列
         */

        this.timer = null;
        // 合并 window.name & localStorage
        const cacheSet = Object.assign({},
            this._.LocStorage.get(),
            this._.windowData.get()
        );
        // 过滤合法消息队列缓存
        const filterLegalCacheKey = (key: string) => /report_temp_(\d{6}$)/g.test(key);
        // 过滤出所有合法消息队列缓存索引
        const msgsKeys: string[] = Object.keys(cacheSet).filter(filterLegalCacheKey);
        // 映射成消息，需要判断是否是 json
        const msgs: Msg[] = msgsKeys.reduce((temp: Msg[], key: string) => {
            const listItem = this._.isJson(cacheSet[key]) ? JSON.parse(cacheSet[key]) : cacheSet[key];
            return [ ...temp, ...listItem ];
        }, []);
        // 重载消息队列
        this.push(msgs);
        // 清理缓存
        msgsKeys.forEach(key => {
            this._.LocStorage.remove(key);
            this._.windowData.remove(key);
        });
    }

    private onUnload() {

        /**
         * 卸载页面时
         * 尝试消费消息队列中的数据
         * 若消费失败，将消息缓存进 window.name & localStorage，使用相同的 chunk 关联
         * 在下次重载页面时，比较缓存的 chunk ，重新发送
         */

        // 终止进行中的消费任务
        this.timer && (clearTimeout(this.timer), this.timer = null);
        // 尝试通过 sendBeacon API 将消息队列中的所有数据同步消费
        const msgs: Msg[] = this.pull();

        // 若满足一下情况，则将数据缓存
        if (
            msgs.length && /*                                       当前队列存在数据，且 */
            !this._.isSupportBeacon() || /*                         设备本身不支持 sendBeacon API，或 */
            !this.customer || /*                                    当前未绑定消费者，或 */
            !this.customer.notify(msgs, { useBeacon: true }) /*     同步消费失败 */
        ) {
            const cache_chunk = this._.createCacheKey();
            this._.LocStorage.set(cache_chunk, msgs);
            this._.windowData.set(cache_chunk, msgs);
        }
    }

    constructor(
        @inject(TYPES.Utils) _: Utils,
        @inject(TYPES.AppEvent) events: AppEvent
    ) {

        this._ = _;
        this.events = events;
        
        this.onload();

        window.addEventListener('pagehide', this.onUnload.bind(this));
    }

    bindCustomer(cstm: { notify: (...rest: any[]) => Promise<boolean> | boolean }) {
        // 暂时支持单一消费者
        this.customer = cstm;
    }

    // 获取消息队列的一份拷贝
    getQueue() {
        return this._.deepCopy(this.queue) as Msg[];
    }

    // 推送数据
    push(data: Msg | Msg[]) {
        this.queue = this.queue.concat(data);

        // 节流
        // 若绑定了消费者，则尝试通知消费者消费数据，且当前不存在上报任务
        if (this.customer && !this.timer) {

            // 通知消费者消费数据
            this.timer = setTimeout(() => {
                const msgs = this.pull();
                msgs.length && this.customer.notify(msgs);
                this.timer = null;
            }, this.delay);
        }

    }

    // 拉取数据唯一入口
    pull() {
        const msgs: Msg[] = this.getQueue();
        this.queue = [];
        return msgs;
    }

}
