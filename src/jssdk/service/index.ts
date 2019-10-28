import http from './request';

export const Service: Service = {

    ERR_OK: '0',

    /**
     * 增量设置请求头
     */
    setHeader: http.setHeader,

    appLoginAPI: data => http.get('public', '/sys/login', data),

    reportAPI: data => http.post('public', '/log', data),
}