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
    // 容器注入 | API
    @inject(TYPES.Service) private service: Service;
    // 容器注入 | 应用配置相关信息
    @inject(TYPES.Conf) private conf: AppConfig;
    // 容器注入 | 消息通知
    // @inject(TYPES.Message) private message: Message;

    private modeContainer: {
        [x: string]: ModeLifeCycle
    };

    set mode(modeType: string) {
        if (!this.modeContainer[modeType]) {
            throw Error('Error in change mode: you are trying to enter an extra mode, please check the version of the jssdk you cited !');
        };
        if (this.mode === modeType) return;
        // last mode exit
        this._mode && this._mode.onExit();
        // 更新 mode
        this._mode = this.modeContainer[modeType];
        // mode enter
        this._mode.onEnter();
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
    async init(user: UserInfo) {

        // 接口校验用户信息
        const [ err, res ] = await this._.errorCaptured(this.service.appLoginAPI, null, user);

        // 未通过：警告
        if (err) {
            // this._.inIframe() && this.message.error('jssdk 初始化失败', 5000);
            this._.inIframe() && alert('jssdk 初始化失败');
            throw Error(`jssdk login error: ${JSON.stringify(err)}`)
        };
        
        const { name, version, browser, connType } = this._.deviceInfo();

        // 通过：保存签名，登录等信息至容器 初始化当前模式
        this.conf.set({
            ...res.sysInfo,
            openId: user.openId,
            batchId: this._.createVisitId(res.sysInfo.appId),
            // 网络层系统配置
            sysConfig: res.sysConfig,
            // 设备信息
            clientType: browser,
            sysVersion: `${name} ${version}`,
            userNetWork: connType
        });

        // this.service.setHeader();

        if (this._.inIframe()) {

            /* **************** 配置模式 **************** */

            // 切换模式
            this.mode = 'browse';
            // 将sdk初始化数据传递给父级Iframe
            const config = {
                tag: 'appConfig',
                config: this.conf.getSelf()
            }
            window.parent && window.parent.postMessage(JSON.stringify(config), '*');

            // 绑定模式切换事件
            this.events.messageOf('mode').subscribe((msg: Obj) => {
                // Reflect.defineMetadata('onMessageSetModeWithPoint', msg.data.points, this);
                this.mode = msg.data.mode;
                // mode enter
                // this._mode.onEnter(msg.data.points);
            });

        } else {

            /* **************** 埋点上报模式 **************** */

            this.mode = 'report';
        }
        
        // this.mode = this._.inIframe() ? 'browse' : 'report';
        // mode enter
        // this._mode.onEnter();

    }

    // 提供应用开发人员主动埋点能力
    push(data: Obj) {
        this._mode.onTrigger(data);
    }
}