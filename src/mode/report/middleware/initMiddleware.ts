export const initMiddleware = (ctx: any) => (next: Function) => (...opt: any) => {

    // console.log('initMiddleware');

    const conf = ctx.conf.get();
    // 初始化访问流水号
    let batchId = ctx._.windowData.get('batchId');
    if (!batchId) {
        batchId = ctx._.createVisitId(conf.appId);
        ctx._.windowData.set('batchId', batchId);
    }

    // 初始化设备信息
    const { name, version, browser, connType } = ctx._.deviceInfo();

    // 保存签名，登录等信息至容器
    const newUser = {
        ...conf,
        batchId,
        // 设备信息
        clientType: browser,
        sysVersion: `${name} ${version}`,
        userNetWork: connType
    };
    ctx.conf.merge(newUser);
    ctx._.windowData.set('user', newUser);

    const initData = { type: 1 };

    // 推送至消息队列
    const res = next(initData);

    console.log('initMiddleware');

    return res;
};