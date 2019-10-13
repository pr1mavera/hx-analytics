const _ = <Utils>function() {}

/**
 * 判断应用是否在 iframe 内
 */
_.inIframe = () => window && window.self === window.top;

/**
 * 判断是否是某类型
 * @param {String} _type 类型(字符串)
 * @param {Any} _staff 待判断的内容
 */
_.isType = (type, staff) => Object.prototype.toString.call(staff) === `[object ${type}]`;

/**
 * 生成访问记录唯一标识
 * @param {String} appId 应用id
 */
_.createVisitId = function(appId) {
    return ''
        // 应用id
        + appId
        // 当前访问时间（到秒）
        + this.formatDate('yyyy-MM-dd-hh-mm-ss').split(/-/g).join('')
        // 6位随机数
        + this.randomInRange(100000, 999999);
};

/**
 * 日期格式化
 * @param {String} format 期望日期格式
 * @param {Date} date 时间对象，可选，若不传则默认为当前时间
 */
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

/**
 * 生成一定范围内的随机数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 */
_.randomInRange = (min, max) => Math.floor(Math.random() * (max - min) + min);

export default _;
