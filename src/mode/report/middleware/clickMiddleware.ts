export const clickMiddleware = (ctx: any) => (next: Function) => (...opt: any) => {

    console.log('clickMiddleware');

    const [ funcId, _opt ] = opt;

    const reqData = next({
        ..._opt,
        type: 2,
        eventId: 'click',
        isSysEvt: 'N',
        funcId
    });

    return reqData;
};