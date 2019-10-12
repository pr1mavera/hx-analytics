var _ = function () { };
_.inIframe = function () { return window && window.self === window.top; };
_.createVisitId = function (appId) {
    return ''
        // 应用id
        + appId
        // 当前访问时间（到秒）
        + this.formatDate('yyyy-MM-dd-hh-mm-ss').split(/-/g).join('')
        // 6位随机数
        + this.randomInRange(100000, 999999);
};
_.formatDate = function (format, date) {
    if (date === void 0) { date = new Date(); }
    var map = {
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
            var ms = "00" + date.getMilliseconds();
            return ms.substr(ms.length - 3);
        }
        return all;
    });
    return format;
};
_.randomInRange = function (min, max) { return Math.floor(Math.random() * (max - min) + min); };
export default _;
