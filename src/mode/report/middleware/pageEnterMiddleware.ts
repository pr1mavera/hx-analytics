export const pageEnterMiddleware = (ctx: any) => (next: Function) => (...opt: any) => {
    // console.log('clickMiddleware');
    const [ pageId, pageUrl, _opt ] = opt;

    const reqData = next({
        ..._opt,
        type: 2,
        eventId: 'pageEnter',
        isSysEvt: 'Y',
        pageId,
        pageUrl,
        enterTime: Date.now()
    });

    console.log('pageEnterMiddleware');

    return reqData;
};