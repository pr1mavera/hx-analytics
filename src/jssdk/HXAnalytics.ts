import 'reflect-metadata';
import _ from '../utils';
import { Browse, Setting, Report } from '../mode';
import * as events from '../jssdk/events';
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

export class HXAnalytics {

    _mode: ModeLifeCycle;
    modeContainer: {
        [ key: string ]: ModeLifeCycle
    };

    set mode(modeType: string) {
        if (this.mode === modeType) return;
        // last mode exit
        this._mode && this._mode.onExit();
        // 更新 mode
        this._mode = this.modeContainer[modeType];
        // mode enter
        this._mode.onEnter(Reflect.getMetadata('onMessageSetMode', this));
    }
    get mode(): string {
        return this._mode ? this._mode.modeType : null;
    }

    constructor() {
        // this.modeContainer = mode;
    }
    // 提供应用开发人员主动埋点能力
    push(data: Obj) {
        this._mode.onTrigger(data);
    }
    init(user: UserInfo, { mode }: Container = {
        mode: {
            browse: new Browse(events, user),
            report: new Report(events, user),
            setting: new Setting(events, user)
        }
    }) {
        this.modeContainer = mode;
        this.mode = _.inIframe() ? 'browse' : 'report';

        // 绑定模式切换事件
        events.messageOf('mode').subscribe((msg: Obj) => {
            Reflect.defineMetadata('onMessageSetModeWithPoint', msg.data.points, this);
            this.mode = msg.data.mode;
        });
        return this;
    }
}