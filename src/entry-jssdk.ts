import container from './jssdk/inversify.config';
import TYPES from './jssdk/types';

// window.onerror = function (msg, url, row, col, error) {
//     console.log('错误 ❌: ', {
//         msg, url, row, col, error
//     });
//     // return true 防止错误向上抛出
//     return true;
// }

// window.addEventListener('unhandledrejection', e => {
//     e.preventDefault();
//     console.log('错误 ❌: ', e.reason);
// }, true);

const _ = container.get<Utils>(TYPES.Utils);

var haTemp: any = _.deepCopy<Array<any>>(ha) || [];

const hxAnalytics = container.get<HXAnalytics>(TYPES.HXAnalytics);

hxAnalytics.push(haTemp);

ha = hxAnalytics;

export default ha;

// interface PointBase {
//     pid: 'span.corner.top!document.querySelector()!sysId!pageId'
// }
// interface Point extends PointBase {
//     pid: string;
//     tag: string;
//     rect: number[];
// }

// 切换模式
// {
//     tag: 'mode',
//     mode: 'setting' | 'browse',
//     points: PointBase[]
// }

// 重置
// {
//     tag: 'reset',
//     points?: PointBase[]
// }

// 预置埋点，不渲染
// {
//     tag: 'preset',
//     points: PointBase[]
// }

// 捕捉到元素
// {
//     isRepeat: Boolean,
//     point: Point,
//     tag: 'selectPoint'
// }

// todo:

// IoC 容器重构公共模块
// 错误处理
// 上报统一格式配置
// 行为上报控制器切换 接口 / 本地缓存
// 文档

// 客户端日志上报与可视化埋点模式分离
// 用户身份校验
// 页面停留时长 页面切换机制
// 单测
