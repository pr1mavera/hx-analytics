import TYPES from './types';
import { inject, injectable } from 'inversify';

@injectable()
export class HXAnalytics implements HXAnalytics {
    [x: string]: any;

    /**
     * 当前模式
     */
    private _mode: ModeLifeCycle;

    /**
     * 模式修改
     * 
     * @see 对mode赋值时，执行对应模式的生命周期
     */
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

    /**
     * 模式获取
     * 
     * @see 只返回对应模式的modeType
     */
    get mode(): string {
        return this._mode ? this._mode.modeType : null;
    }

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

    /**
     * 模式容器
     */
    private modeContainer: {
        [x: string]: ModeLifeCycle
    };

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
    private async init([ appId, sysId, openId ]: string[]) {

        // 初始化用户基本信息
        let user_temp = this._.windowData.get('user');
        if (
            !user_temp ||
            user_temp.appId != appId ||
            user_temp.sysId != sysId
        ) {
            const user = { appId, sysId, openId };
            // 接口校验用户信息
            const [ err, res ] = await this._.errorCaptured(
                this.service.appLoginAPI,
                (data: Obj) => ({ sysConfig: data.sysConfig, ...data.sysInfo }),
                user
            );
            // 未通过：警告
            if (err) {
                // this._.inIframe() && this.message.error('jssdk 初始化失败', 5000);
                this._.inIframe() && alert('jssdk 初始化失败');
                throw Error(`jssdk login error: ${JSON.stringify(err)}`);
            };
            // 更新用户基本信息
            user_temp = res;
        }

        // 保存签名，登录等信息至容器
        const newUser = {
            ...user_temp,
            openId: openId,
            batchId: this._.createVisitId(user_temp.appId),
            sysConfig: user_temp.sysConfig
        };
        this.conf.merge(newUser);
        this._.windowData.set('user', newUser);
        this._.windowData.set('batchId', newUser.batchId);

        // this.service.setHeader();

        // 初始化当前模式
        if (this._.inIframe()) {

            /* **************** 配置模式 **************** */

            // 切换模式
            this.mode = 'browse';
            // 将sdk初始化数据传递给父级Iframe
            const config = {
                tag: 'appConfig',
                config: this.conf.get()
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

        // 添加访问记录
        this._mode.onTrigger([ 'init', newUser.appId, newUser.sysId, newUser.openId ]);
    }

    /**
     * 提供应用开发人员主动埋点能力
     * 
     * @param {Array} cmds 埋点命令及参数
     */
    async push(cmds: Array<any>[] = []) {
        cmds.forEach((cmd: any[]) => {
            const [ directive, ...params ] = cmd;
            // 当前实例上是否存在该命令
            // 是，执行（实际上基本是需要当前实例进过包装，在内部再执行当前模块上的onTrigger）
            // 否，则执行当前模块上的onTrigger
            const _this: HXAnalytics = this;
            _this[directive] ? _this[directive](params) : _this._mode.onTrigger(cmd);
        });
    }
}