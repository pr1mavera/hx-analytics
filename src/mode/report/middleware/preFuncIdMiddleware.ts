export const preFuncIdMiddleware = (ctx: any) => (next: Function) => (opt: any) => {

    console.log('preFuncIdMiddleware');

    // 上一次行为事件唯一标识
    // 首次打开窗口加载页面的时候上一次行为数据为空字符串，即第一次行为数据没有 preFuncId ，默认为 '-'
    const lastCustomData = ctx._.windowData.get('lastCustomData');
    const preFuncId = lastCustomData && lastCustomData.funcId || '-';

    const reqData = next({ preFuncId, ...opt });

    // 缓存进 window.name ，在下一次上报时使用
    ctx._.windowData.set('lastCustomData', reqData);

    return reqData;
};