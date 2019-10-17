const _ = <Utils>function() {}

_.unboundMethod = function(methodName: string, argCount: number = 2) {
    return this.curry(
        (...args: any[]) => {
            const obj = args.pop();
            return obj[methodName]( ...args );
        },
        argCount
    );
}

_.curry = (fn: Fn, arity: number = fn.length) => {
	// 1. 构造一个这样的函数：
	//    即：接收前一部分参数，返回一个 接收后一部分参数 的函数，返回的那个函数需在内部判断是否执行原函数
	const nextCurried = (...prev: any[]) =>
							(...next: any[]) => {
								const args = [ ...prev, ...next ];

								return args.length >= arity
										? fn(...args)
										: nextCurried(...args)
							};

	// 2. 将构造的这个函数执行并返回，初始入参为空
	return nextCurried();
};

_.map = _.unboundMethod('map', 2);

const { sessionStorage, localStorage } = <Window>window;
const [ SessStorage, LocStorage ] = _.map(
    (storage: Storage) => ({
        get: key => JSON.parse(storage.getItem(key)),
        set: (key, val) => storage.setItem(key, JSON.stringify(val)),
        remove: key => storage.removeItem(key),
        clear: () => storage.clear()
    } as CstmStorage)
)
( [ sessionStorage, localStorage ] );
_.SessStorage = SessStorage;
_.LocStorage = LocStorage;

_.inIframe = () => window && window.self !== window.top;

_.isType = (type, staff) => Object.prototype.toString.call(staff) === `[object ${type}]`;

_.createVisitId = function(appId) {
    return ''
        // 应用id
        + appId
        // 当前访问时间（到秒）
        + this.formatDate('yyyy-MM-dd-hh-mm-ss').split(/-/g).join('')
        // 6位随机数
        + this.randomInRange(100000, 999999);
};

_.formatDate = (format, date = new Date()) => {
    const map: {
        [key: string]: number | string;
    } = {
        'M': date.getMonth() + 1, // 月份
        'd': date.getDate(), // 日
        'h': date.getHours(), // 小时
        'm': date.getMinutes(), // 分
        's': date.getSeconds(), // 秒
        'q': Math.floor((date.getMonth() + 3) / 3) // 季度
    };
    format = format.replace(/([yMdhmsqS])+/g, <(substring: string, ...args: any[]) => string>function(all: string, t: any) {
        var v = map[t];
        if (v !== void 0) {
            if (all.length > 1) {
                v = '0' + v;
                v = v.substr(v.length - 2);
            }
            return v;
        } else if (t === 'y') {
            return (date.getFullYear() + '').substr(4 - all.length);
        } else if (t === 'S') {
            const ms = `00${date.getMilliseconds()}`;
            return ms.substr(ms.length - 3);
        }
        return all;
    });
    return format;
};

_.randomInRange = (min, max) => Math.floor(Math.random() * (max - min) + min);

_.mixins = function(...list) {
    return function (constructor) {
        Object.assign(constructor.prototype, ...list);
    }
}

export default _;
