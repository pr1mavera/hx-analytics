export const loggerMiddleware = (ctx: any) => (next: Function) => (opt: any) => {
    console.log('-----------------------------');
    console.log('loggerMiddleware ', ctx.mq.getQueue());

    const res = next(opt);

    console.log('loggerMiddleware ', ctx.mq.getQueue());
    console.log('-----------------------------');

    return res;
};