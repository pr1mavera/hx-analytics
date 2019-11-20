export const pageDwellMiddleware = (ctx: any) => (next: Function) => (...opt: any) => {
    // console.log('clickMiddleware');
    const [ enterTime, leaveTime, pageDwellTime, pageId, pageUrl ] = opt;

    const reqData = next({ type: 2, eventId: 'pageDwell', enterTime, leaveTime, pageDwellTime, pageId, pageUrl });

    console.log('pageDwellMiddleware');

    return reqData;
};