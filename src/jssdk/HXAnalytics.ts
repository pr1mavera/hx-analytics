import TYPES from './types';
import { inject, injectable } from 'inversify';

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

@injectable()
export class HXAnalytics implements HXAnalytics {

    private _mode: ModeLifeCycle;

    // 容器注入 | 事件
    @inject(TYPES.AppEvent) private events: AppEvent;
    // 容器注入 | 工具
    @inject(TYPES.Utils) private _: Utils;

    private modeContainer: {
        [x: string]: ModeLifeCycle
    };

    set mode(modeType: string) {
        if (!this.modeContainer[modeType]) {
            throw Error('you are trying to enter an extra mode, please check the version of the jssdk you cited !')
        };
        if (this.mode === modeType) return;
        // last mode exit
        this._mode && this._mode.onExit();
        // 更新 mode
        this._mode = this.modeContainer[modeType];
        // mode enter
        // this._mode.onEnter(Reflect.getMetadata('onMessageSetMode', this));
    }
    get mode(): string {
        return this._mode ? this._mode.modeType : null;
    }

    constructor(
        // 容器注入 | 模式
        @inject(TYPES.Browse) browse: ModeLifeCycle,
        @inject(TYPES.Report) report: ModeLifeCycle,
        @inject(TYPES.Setting) setting: ModeLifeCycle,
        // @inject(TYPES.ModeContainer) modeContainer: {
        //     [x: string]: ModeLifeCycle
        // }
    ) {
        this.modeContainer = { browse, report, setting };
        // this.modeContainer = modeContainer;
    }

    // 应用初始化入口
    init(user: UserInfo) {
        
        this.mode = this._.inIframe() ? 'browse' : 'report';
        // mode enter
        this._mode.onEnter();

        // 绑定模式切换事件
        this.events.messageOf('mode').subscribe((msg: Obj) => {
            // Reflect.defineMetadata('onMessageSetModeWithPoint', msg.data.points, this);
            this.mode = msg.data.mode;
            // mode enter
            this._mode.onEnter(msg.data.points);
        });

        return this;
    }

    // 提供应用开发人员主动埋点能力
    push(data: Obj) {
        this._mode.onTrigger(data);
    }
}