export const clickMiddleware = (ctx: any) => (next: Function) => (...opt: any) => {

    console.log('clickMiddleware');

    const [ funcId ] = opt;

    const reqData = next({ type: 2, eventId: 'click', funcId });

    return reqData;
};