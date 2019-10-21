import 'reflect-metadata';
import _ from '../utils';
import { Browse, Setting, Report } from '../mode';
import * as events from './events';
// import http from './service/request';
// const getUserInfoByOpenID = (openID: string) => http.get('user', `/video/user?openId=${openID}`);
// window.addEventListener('beforeunload', () => {
//     localStorage.setItem('isUserMessageSendSuccT', JSON.stringify(Date.now()));
//     getUserInfoByOpenID('oKXX7wKQhDf0sixuV0z-gEB8Y8is').then((res: Obj) => {
//         console.log('用户信息: ', res);
//         localStorage.setItem('isUserMessageSendSucc', JSON.stringify(res));
//     })
// })
// const visit = _.createVisitId('SPKF');
// console.log('访客码： ', visit);
// 初始化 -> 校验签名是否合法
//     非法 -> mode: none
//     合法 -> 判断当前环境 app / iframe
//         app -> 将本地缓存未上报的信息上报
//              是否 B/A
//                  是 -> mode: report
//                  否 -> mode: none
//         iframe -> 校验 iframe 来源是否有效
//             有效 -> mode: catch
//             无效 -> mode: none
// ha 需要提供的 API : （只负责管理模式及事件推送）
// 初始化 init | public
// 行为事件主动上报 push | public
// 上报统一入口 _report | private
// 模式切换 _changeMode | private
class HXAnalytics {
    constructor({ mode }) {
        this.modeContainer = mode;
        this.mode = _.inIframe() ? 'browse' : 'report';
        // 绑定模式切换事件
        events.messageOf('mode').subscribe((msg) => {
            Reflect.defineMetadata('onMessageSetModeWithPoint', msg.data.points, this);
            this.mode = msg.data.mode;
        });
    }
    set mode(modeType) {
        if (this.mode === modeType)
            return;
        // last mode exit
        this._mode && this._mode.onExit();
        // 更新 mode
        this._mode = this.modeContainer[modeType];
        // mode enter
        this._mode.onEnter(Reflect.getMetadata('onMessageSetMode', this));
    }
    get mode() {
        return this._mode ? this._mode.modeType : null;
    }
    // 提供应用开发人员主动埋点能力
    push(data) {
        this._mode.onTrigger(data);
    }
    init() {
        return this;
    }
}
const ha = new HXAnalytics({
    mode: {
        browse: new Browse(),
        report: new Report(events),
        setting: new Setting(events)
    }
});
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
// IoC 容器重构公共模块
// 错误处理
// 上报统一格式配置
// 行为上报控制器切换 接口 / 本地缓存
// 用户身份校验
// 页面停留时长 页面切换机制
// 单测
// 文档
