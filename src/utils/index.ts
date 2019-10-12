const _ = <_>function() {}

_.inIframe = () => window && window.self === window.top;

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

export default _;
