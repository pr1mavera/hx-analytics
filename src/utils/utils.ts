import whatsElement from 'whats-element/src/whatsElementPure';
import { Md5 } from 'ts-md5/dist/md5'

const ERR_OK = '0';
// import { Service } from '../jssdk/service';

export const _: Utils = <Utils>{}

_.hashInRange = (range, str) => Md5.hashStr(str).slice(0, range) as string;

_.compose = (...fns) => fns.reduce((f: Function, g: Function) => (...args: any[]) => f(g(...args)));

_.pipe = (...fns) => _.compose(...fns.reverse());

_.pack = (arity) => arr => arr.reduce((temp: Array<Array<any>>, tar: any, i: number) => {
    const key = Math.floor(i / arity);
    temp[key] ? temp[key].push(tar) : temp[key] = [ tar ];
    return temp;
}, []);

_.first = arr => (arr && _.isType('Array', arr) && arr[0]) || null;

_.last = arr => (arr && _.isType('Array', arr) && arr.length) ? arr[arr.length - 1] : null;

const { sessionStorage, localStorage } = <Window>window;
const [ SessStorage, LocStorage ] = [ sessionStorage, localStorage ].map(
    (storage: Storage) => ({
        get: (key = '') => {
            return key ?
                JSON.parse(storage.getItem(key)) :
                storage;
        },
        set: (key, val) => {
            storage.setItem(key, JSON.stringify(val));
        },
        remove: key => {
            storage.removeItem(key);
        },
        clear: () => {
            storage.clear();
        }
    } as CustomStorage)
);
_.SessStorage = SessStorage;
_.LocStorage = LocStorage;

_.windowData = {
    get(key = '') {
        // 格式化 window.name，保证 window.name 一定是JSON字符串
        !window.name && (window.name = JSON.stringify({}));

        // 获取安全的 window.name 数据
        let safeData = undefined;
        try {
            safeData = JSON.parse(window.name);
        } catch (error) {
            safeData = {};
        }

        // 若传入了 key ，表示需要获取某个字段的值: any ，若不传表示获取完整的 window.name: Object
        return key ? (safeData[key] ? safeData[key] : '') : safeData;
    },
    set(key, val) {
        // window.name = JSON.stringify(val);
        const wData = this.get() || {};
        window.name = JSON.stringify({ ...wData, [key]: val });
    },
    remove(key) {
        const wData = this.get() || {};
        wData.hasOwnProperty(key) && delete wData[key];
        window.name = JSON.stringify(wData);
    },
    clear() {
        window.name = JSON.stringify({});
    }
};

/**
 * 获取页面唯一标识
 * 
 * 策略：
 * 1. 获取 pathname, hash
 * 2. 将 hash 后面的可能携带的 query 去掉，并且与 pathname 拼接，得到 pagePath
 * 3. 将 pagePath 的 '#' 替换成 '_'
 * 
 * 这里需要将 '#' 替换成 '_' 的原因：
 * 因为配置埋点的过程中，需要查询当前页面埋点，而该接口为get接口，查询所附带的参数是作为query拼接的
 * 访问接口的时候会将 '#' 以及后面的参数忽略掉，导致查询不到结果
 * 因此这里的做法是将 '#' 替换成 '_'
 */
_.getPageId = () => {
    const { pathname, hash } = window.location;
    // return pathname + _.first(hash.split('?'));
    const pagePath = pathname + (_.first(hash.split('?')) || '');
    // 替换
    const pageId = pagePath.replace(/#/g, '_');
    return pageId;
};

/**
 * 获取页面唯一路径，并根据提供的 publicPath 切割路径，得到生成与测试环境统一的 pathId
 * 
 * publicPath 格式规则：
 * 1. 不能为 falsy 值 或 空字符串
 * 2. 以'/'开头，以字符结尾，中间可穿插'/'，如: '/video'，'/video/zhike'
 */
_.normalizePageId = publicPath => {

    const pageId = _.getPageId();
    const isPublicPathLegally = publicPath && /^\/(\w|\/)+\w$/.test(publicPath);

    // 若传入的 publicPath 不合法，默认直接返回宿主环境收集到的 pageId
    if (!isPublicPathLegally) return pageId;

    return pageId.replace(new RegExp(`^(${publicPath})`), '');
}

_.inIframe = () => window && window.self !== window.top;

_.isType = (type, staff) => Object.prototype.toString.call(staff) === `[object ${type}]`;

_.isJson = str => {
    if (!_.isType('String', str)) return false;
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
};

_.isSupportBeacon = () => 'object' == typeof window.navigator && 'function' == typeof window.navigator.sendBeacon;

_.deepCopy = obj => JSON.parse(JSON.stringify(obj));

_.firstUpperCase = str => str.toLowerCase().replace(/( |^)[a-z]/g, (s: string) => s.toUpperCase());

_.splitQuery = str => {
    if (!str) return {};
    const querystrList = str.split('&');
    return querystrList.map((querystr: string) => querystr.split('='))
                        .reduce((temp: Obj, queryItem: Array<string>) => ({
                            ...temp, [_.first(queryItem)]: queryItem[1]
                        }), {});
};

_.createVisitId = appId => {
    return ''
        // 应用id
        + appId
        // 当前访问时间（到秒）
        + _.formatDate('yyyy-MM-dd-hh-mm-ss').split(/-/g).join('')
        // 6位随机数
        + _.randomInRange(100000, 999999);
};

_.createCacheKey = () => `report_temp_${_.randomInRange(100000, 999999)}`;

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
    format = format.replace(/([yMdhmsqS])+/g, <(substring: string, ...args: any[]) => string>function (all: string, t: any) {
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

_.getElemPid = function (sysId, pageId, e) {
    try {
        const { type, wid } = new whatsElement().getUniqueId(e);
        // const { type, wid } = { type: 'type', wid: 'wid' };
        return `${wid}!${type}!${sysId}!${pageId}`;
    } catch {
        return null;
    }
};

_.getElemByPid = (curPageId, pid) => {
    const [ id, , , pageId ] = pid.split('!');
    // 校验是否是同一个页面，若不是则直接返回未找到
    if (pageId !== curPageId) return null;
    return document.getElementById(id) || document.getElementsByName(id)[0] || document.querySelector(id);
};

_.getElemClientRect = e => {
    const { left, top, width, height } = e.getBoundingClientRect();
    // [ x, y, w, h ]
    return [ Math.round(left), Math.round(top), Math.round(width), Math.round(height) ];
}

_.errorCaptured = async (asyncFn, formatter, ...rest) => {
    try {
        const { result: { code, message }, data } = await asyncFn(...rest);
        if (code === ERR_OK) {
            return [ null, formatter ? formatter(data) : data ];
        } else {
            return [ message, data ];
        }
    } catch (ex) {
        return [ ex, null ];
    }
};

_.deviceInfo = () => {
    const u = navigator.userAgent;
    const ua = u.toLowerCase();
    let name: string;
    let version: number;
    let browser: string = 'wx';
    let connType: string = '';
    try {
        connType = /NetType/.test(ua) ? ua.match(/NetType\/(\S*)$/)[1] : 'unknown';
    } catch {
        connType = 'unknown';
    }

    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
        // Android
        const reg = /android [\d._]+/gi;
        name = 'Android';
        version = parseFloat((ua.match(reg) + '').replace(/[^0-9|_.]/ig, '').replace(/_/ig, '.'));
    } else if (u.indexOf('iPhone') > -1) {
        // iPhone
        const ver = ua.match(/cpu iphone os (.*?) like mac os/);
        name = 'iPhone';
        version = parseFloat(ver[1].replace(/_/g, '.'));
        // 微信内置浏览器否
        browser = (ua.match(/MicroMessenger/i) && ua.match(/MicroMessenger/i)[0] == 'micromessenger') ? 'wx' : 'safari';
    } else if (u.indexOf('Windows Phone') > -1) {
        name = 'windowsPhone';
        version = -1;
    }
    return {
        name,
        version,
        browser,
        connType
    };
};

_.nativeCodeEventPatch = (obj, type) => {
    // 这里提前缓存住原始的原生方法
    let orig = obj[type];
    return  function() {
        let rv = orig.apply(this, arguments);
        let e = new Event(type.toLowerCase());
        Object.assign(e, { arguments });
        window.dispatchEvent(e);
    
        return rv;
    }
};