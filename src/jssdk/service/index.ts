import http from './request';

export const Service: Service = {

    ERR_OK: '0',

    /**
     * 增量设置请求头
     */
    setHeader: http.setHeader,

    appLoginAPI: data => http.get('public', '/sys/login', data),

    reportAPI: body => http.post('public', '/log', null, { body }),

    reportBeaconAPI: data => window.navigator.sendBeacon(http.splitUrl('public', '/log'), data),

    getPresetPointsAPI: data => http.get('public', '/config/query/list', data)
}