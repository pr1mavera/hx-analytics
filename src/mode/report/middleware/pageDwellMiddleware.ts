export const pageDwellMiddleware = (ctx: any) => (next: Function) => (...opt: any) => {
    // console.log('clickMiddleware');
    const [ enterTime, leaveTime, pageDwellTime, pageId, pageUrl, _opt ] = opt;

    const reqData = next({
        ..._opt,
        type: 2,
        eventId: 'pageDwell',
        isSysEvt: 'Y',
        enterTime,
        leaveTime,
        pageDwellTime,
        pageId,
        pageUrl
    });

    console.log('pageDwellMiddleware');

    return reqData;
};