import whatsElement from 'whats-element/src/whatsElementPure';
const _ = function () { };
_.unboundMethod = function (methodName, argCount = 2) {
    return this.curry((...args) => {
        const obj = args.pop();
        return obj[methodName](...args);
    }, argCount);
};
_.curry = (fn, arity = fn.length) => {
    // 1. 构造一个这样的函数：
    //    即：接收前一部分参数，返回一个 接收后一部分参数 的函数，返回的那个函数需在内部判断是否执行原函数
    const nextCurried = (...prev) => (...next) => {
        const args = [...prev, ...next];
        return args.length >= arity
            ? fn(...args)
            : nextCurried(...args);
    };
    // 2. 将构造的这个函数执行并返回，初始入参为空
    return nextCurried();
};
_.map = _.unboundMethod('map', 2);
const { sessionStorage, localStorage } = window;
const [SessStorage, LocStorage] = _.map((storage) => ({
    get: key => JSON.parse(storage.getItem(key)),
    set: (key, val) => storage.setItem(key, JSON.stringify(val)),
    remove: key => storage.removeItem(key),
    clear: () => storage.clear()
}))([sessionStorage, localStorage]);
_.SessStorage = SessStorage;
_.LocStorage = LocStorage;
_.inIframe = () => window && window.self !== window.top;
_.isType = (type, staff) => Object.prototype.toString.call(staff) === `[object ${type}]`;
_.createVisitId = function (appId) {
    return ''
        // 应用id
        + appId
        // 当前访问时间（到秒）
        + this.formatDate('yyyy-MM-dd-hh-mm-ss').split(/-/g).join('')
        // 6位随机数
        + this.randomInRange(100000, 999999);
};
_.formatDate = (format, date = new Date()) => {
    const map = {
        'M': date.getMonth() + 1,
        'd': date.getDate(),
        'h': date.getHours(),
        'm': date.getMinutes(),
        's': date.getSeconds(),
        'q': Math.floor((date.getMonth() + 3) / 3) // 季度
    };
    format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
        var v = map[t];
        if (v !== void 0) {
            if (all.length > 1) {
                v = '0' + v;
                v = v.substr(v.length - 2);
            }
            return v;
        }
        else if (t === 'y') {
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        else if (t === 'S') {
            const ms = `00${date.getMilliseconds()}`;
            return ms.substr(ms.length - 3);
        }
        return all;
    });
    return format;
};
_.randomInRange = (min, max) => Math.floor(Math.random() * (max - min) + min);
_.getElemPid = function (sysId, pageId, e) {
    try {
        const { type, wid } = new whatsElement().getUniqueId(e);
        return `${wid}!${type}!${sysId}!${pageId}`;
    }
    catch (_a) {
        return null;
    }
};
_.getElemByPid = pid => {
    const id = pid.split('!')[0];
    return document.getElementById(id) || document.getElementsByName(id)[0] || document.querySelector(id);
};
_.getElemClientRect = e => {
    const { left, top, right, bottom } = e.getBoundingClientRect();
    // [ x, y, w, h ]
    return [left, top, right - left, bottom - top];
};
_.mixins = function (...list) {
    return function (constructor) {
        Object.assign(constructor.prototype, ...list);
    };
};
_.reloadConstructor = function (constructor) {
    return class ReloadConstructor extends constructor {
    };
};
export default _;
