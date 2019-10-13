// import './fetch';

import conf from '../../config/index';
import _ from '../../utils';
// import { RequestMethods, RequestOptions } from '../../types';

/**
 * 拼接请求地址
 * splitUrl :: (String -> String) -> String
 * @param {String} host 服务主机地址
 * @param {String} path API地址
 */
const splitUrl: (host: string, path: string) => string
    = (host, path) => (conf as any)[host] + path;

export default (() => {
    // 请求头暂存
    let _header = {};

    /**
     * 统一http请求入口
     * @param {String} method http请求方式
     * @param {String} url 请求URL
     * @param {Object} data 请求体，将转为 json 之后作为 fetch 的 body 传入
     * @param {Object} options 额外参数（注意：options 中设置的 body 将被忽略，请传入 data 参数代替）
     */
    const _request: SafeRequestEntry = (method, url, data, options = {}) => {
        let { headers, body, ...rest } = options;

        body && console.warn('options 中设置的 body 将被忽略，请传入 data 参数代替');

        const safeOptions = {
            method,
            // 合并请求头，新传入的可代替公共的
            headers: { ..._header, ...headers },
            ...rest
        }
        method === 'POST' || method === 'PUT' && Object.assign(safeOptions, {
            body: JSON.stringify(data),
        });
    
        return fetch(url, safeOptions)
                .then(response => response.json())
                .catch(err => {
                    console.error(err);
                });
    }

    // 构造request方法
    return {

        /**
         * 增量设置请求头
         */
        setHeader: newHeader => {
            _header = { ..._header, ...newHeader };
        },

        get: (host, url, options) => _request('GET', splitUrl(host, url), null, options),

        post: (host, url, data, options) => _request('POST', splitUrl(host, url), data, options),

        put: (host, url, data, options) => _request('PUT', splitUrl(host, url), data, options),

        delete: (host, url, options) => _request('DELETE', splitUrl(host, url), null, options),

        url: (host, url) => splitUrl(host, url),

    } as SafeRequest;

})();

