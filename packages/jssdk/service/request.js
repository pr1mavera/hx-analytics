// import './fetch';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import conf from '../../config/index';
// import { RequestMethods, RequestOptions } from '../../types';
/**
 * 拼接请求地址
 * splitUrl :: (String -> String) -> String
 * @param {String} host 服务主机地址
 * @param {String} path API地址
 */
var splitUrl = function (host, path) { return conf[host] + path; };
export default (function () {
    // 请求头暂存
    var _header = {};
    /**
     * 统一http请求入口
     * @param {String} method http请求方式
     * @param {String} url 请求URL
     * @param {Object} data 请求体，将转为 json 之后作为 fetch 的 body 传入
     * @param {Object} options 额外参数（注意：options 中设置的 body 将被忽略，请传入 data 参数代替）
     */
    var _request = function (method, url, data, options) {
        if (options === void 0) { options = {}; }
        var headers = options.headers, body = options.body, rest = __rest(options, ["headers", "body"]);
        body && console.warn('options 中设置的 body 将被忽略，请传入 data 参数代替');
        var safeOptions = __assign({ method: method, 
            // 合并请求头，新传入的可代替公共的
            headers: __assign(__assign({}, _header), headers) }, rest);
        method === 'POST' || method === 'PUT' && Object.assign(safeOptions, {
            body: JSON.stringify(data),
        });
        return fetch(url, safeOptions)
            .then(function (response) { return response.json(); })
            .catch(function (err) {
            console.error(err);
        });
    };
    // 构造request方法
    return {
        /**
         * 增量设置请求头
         */
        setHeader: function (newHeader) {
            _header = __assign(__assign({}, _header), newHeader);
        },
        get: function (host, url, options) { return _request('GET', splitUrl(host, url), null, options); },
        post: function (host, url, data, options) { return _request('POST', splitUrl(host, url), data, options); },
        put: function (host, url, data, options) { return _request('PUT', splitUrl(host, url), data, options); },
        delete: function (host, url, options) { return _request('DELETE', splitUrl(host, url), null, options); },
        url: function (host, url) { return splitUrl(host, url); },
    };
})();
