import http from './request';

export const Service: Service = {

    ERR_OK: '0',

    /**
     * 增量设置请求头
     */
    setHeader: http.setHeader,

    appLoginAPI: data => http.get('user', '/log', data),

    reportAPI: data => http.post('user', '/sys/login', data)
}