// import './fetch';

import conf from '../../config/index';
// import { RequestMethods, RequestOptions } from '../../types';

/**
 * 拼接请求地址
 * splitUrl :: (String -> String -> Object) -> String
 * @param {String} host 服务主机地址
 * @param {String} path API地址
 * @param {Object} data 需要拼接成 query 的对象，可选 { a: 123, b: 456 } -> '?a=123&b=456'
 */
const splitUrl: (host: string, path: string, data?: Obj) => string
    = (host, path, data) => {
        const query =
            data ?
                Object.keys(data).reduce(
                    (q: string, k: string) => q += (q ? '&' : '?') + `${k}=${data[k]}`, ''
                ) :
                '';

        return (conf as any)[host] + path + query;
    };

export default (() => {
    // 全局请求头暂存
    let _header = {
        'content-type': 'application/json'
    };

    /**
     * 统一http请求入口
     * @param {String} method http请求方式
     * @param {String} url 请求URL
     * @param {Object} data 请求体，将转为 json 之后作为 fetch 的 body 传入
     * @param {Object} options 额外参数（注意：options 中设置的 body 将被忽略，请传入 data 参数代替）
     */
    const _request: (
        method: RequestMethods,
        url: string,
        data: Obj | null,
        options?: RequestOptions
    ) => Promise<any>
    = (method, url, data, options = {}) => {
        let { headers, body, ...rest } = options;
        // 存在 body ，则警告并忽略
        body && console.warn(
            'Warn in http request: You are trying to set a request body in args:options, and it will be ignore. Please set it in args:data !  \n',
            `url: ${url} \n`,
            `body: ${JSON.stringify(body)}`,
        );

        const safeOptions = {
            method,
            // 合并请求头，新传入的可代替公共的
            headers: { ..._header, ...headers },
            ...rest
        };

        // 当前是 POST | PUT ，则合并请求体
        (method === 'POST' || method === 'PUT') && Object.assign(safeOptions, {
            body: JSON.stringify(data)
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
            return _header;
        },

        get: (host, url, data, options) => _request('GET', splitUrl(host, url, data), null, options),

        post: (host, url, data, options) => _request('POST', splitUrl(host, url), data, options),

        put: (host, url, data, options) => _request('PUT', splitUrl(host, url), data, options),

        delete: (host, url, options) => _request('DELETE', splitUrl(host, url), null, options),

        url: (host, url) => splitUrl(host, url),

    } as SafeRequest;

})();

