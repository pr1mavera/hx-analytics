import TYPES from '../../jssdk/types';
import { inject, injectable } from 'inversify';

@injectable()
export class MsgsQueue implements MsgsQueue {

    // 队列
    queue: Array<Msg> = [];
    // 上报定时器
    timer: NodeJS.Timeout | null = null;
    // 延迟
    delay: number = 2000;
    // 消费者，目前只支持绑定一个消费者（只支持单一消费）
    customer: { notify: Function } = null;

    // 容器注入 | 工具
    @inject(TYPES.Utils) private _: Utils;

    /**
     * 比较缓存数据，重载消息队列
     * 
     * 思路：
     * 1. 将 localStorage 与 window.name 取出
     * 2. 合并两个缓存并去重，过滤出索引为 report_temp_chunk:6 的缓存
     * 3. 将得到的合法消息队列缓存，映射合并成消息队列可读的消息
     * 
     * 缓存存在的情况：
     * 1. localStorage √ | window.name × ===> 上次访问该页面存在行为数据未处理，上报
     * 2. localStorage × | window.name √ ===> 切至跨域网站，上报
     * 3. localStorage √ | window.name √ ===> 切至同域网站，上报
     * 
     * 其中情况2，最开始处理方式是忽略掉，因为可能导致与情况1重复，后端入库数据量太大无法去重
     * 后来为保证数据上报的及时性，与后端协调查询的时候，由前端处理去重
     */
    onLoad() {

        this.timer = null;
        // 合并 window.name & localStorage
        const cacheSet = Object.assign({},
            this._.LocStorage.get(),
            this._.windowData.get()
        );
        // 过滤器（合法消息队列缓存索引）
        const legalCacheKeyFilter = (key: string) => /report_temp_(\d{6}$)/g.test(key);
        // 过滤出所有合法消息队列缓存索引
        const msgsKeys: string[] = Object.keys(cacheSet).filter(legalCacheKeyFilter);
        // 映射成消息，需要判断是否是 json（由于是直接拿到 localStorage 对象进行合并缓存，获取的 value 都是json）
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

    /**
     * 卸载页面时
     * 尝试消费消息队列中的数据
     * 若消费失败，将消息缓存进 window.name & localStorage，使用相同的 chunk 关联
     * 在下次重载页面时（重新访问页面，或页面重新可见），比较缓存的 chunk ，重载消息队列
     */
    onUnload() {

        // 终止进行中的消费任务
        this.timer && (clearTimeout(this.timer), this.timer = null);
        // 尝试通过 sendBeacon API 将消息队列中的所有数据同步消费
        const msgs: Msg[] = this.pull();

        // 若满足以下情况，则将数据缓存
        if (
            !this._.isSupportBeacon() || /*                         设备本身不支持 sendBeacon API，或 */
            !this.customer || /*                                    当前未绑定消费者，或 */
            msgs.length && /*                                       当前队列存在数据，且 */
            !this.customer.notify(msgs, { useBeacon: true }) /*     同步消费失败 */
        ) {
            const cache_chunk = this._.createCacheKey();
            this._.LocStorage.set(cache_chunk, msgs);
            this._.windowData.set(cache_chunk, msgs);
        }
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
