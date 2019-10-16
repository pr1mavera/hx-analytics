import _ from '../utils';
import { Setting, Report } from '../mode';
import * as events from './events/native';
// import http from './service/request';

// const getUserInfoByOpenID = (openID: string) => http.get('user', `/video/user?openId=${openID}`);
// window.addEventListener('beforeunload', () => {
//     localStorage.setItem('isUserMessageSendSuccT', JSON.stringify(Date.now()));
//     getUserInfoByOpenID('oKXX7wKQhDf0sixuV0z-gEB8Y8is').then((res: object) => {
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

// container
// event
// mode

class HXAnalytics {

    _mode: ModeLifeCycle<any>;
    modeContainer: {
        [ key: string ]: ModeLifeCycle<any>
    };

    get mode(): string {
        return this._mode.modeType;
    }
    set mode(modeType: string) {
        this._mode = this.modeContainer[modeType];
        // 调用 mode 的生命周期
        this._mode.onEnter();
    }

    constructor({ mode }: Container) {
        this.modeContainer = mode;
        this.mode = _.inIframe() ? 'setting' : 'report';

        // 绑定
    }
    // 提供应用开发人员主动埋点能力
    push() {
        this._mode.onTrigger();
    }
    init() {
        return this;
    }
}

const ha = new HXAnalytics({
    mode: {
        report: new Report(events),
        setting: new Setting(events)
    }
} as Container);

export default ha;
