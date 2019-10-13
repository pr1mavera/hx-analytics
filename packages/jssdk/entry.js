import { sayHello } from './events/tstest';
import _ from '../utils';
import http from './service/request';
var getUserInfoByOpenID = function (openID) { return http.get('user', "/video/user?openId=" + openID); };
getUserInfoByOpenID('oKXX7wKQhDf0sixuV0z-gEB8Y8is').then(function (res) {
    console.log('用户信息: ', res);
});
var visit = _.createVisitId('SPKF');
console.log('访客码： ', visit);
// 初始化 -> 校验签名是否合法
//     非法 -> mode: none
//     合法 -> 判断当前环境 app / iframe
//         app -> 是否 B/A
//             是 -> mode: report
//             否 -> mode: none
//         iframe -> 校验 iframe 来源是否有效
//             有效 -> mode: catch
//             无效 -> mode: none
// ha 需要提供的 API :
// 初始化 init | public
// 行为事件主动上报 push | public
// 上报统一入口 _report | private
// 模式切换 _changeMode | private
// 生命周期
console.log(sayHello('1234'));
var HXAnalytics = /** @class */ (function () {
    function HXAnalytics(config) {
        this.mode = 'default';
    }
    HXAnalytics.prototype._report = function () {
    };
    HXAnalytics.prototype._changeMode = function () {
    };
    HXAnalytics.prototype.init = function () {
        return this;
    };
    HXAnalytics.prototype.push = function () {
    };
    return HXAnalytics;
}());
var ha = new HXAnalytics();
export default ha;
