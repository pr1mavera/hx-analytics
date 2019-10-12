
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(document);
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.ha = factory());
}(this, function () { 'use strict';

    function sayHello(name) {
      return "Hello from tstest " + name;
    }

    var _ = function _() {};

    _.inIframe = function () {
      return window && window.self === window.top;
    };

    _.createVisitId = function (appId) {
      return '' // 应用id
      + appId // 当前访问时间（到秒）
      + this.formatDate('yyyy-MM-dd-hh-mm-ss').split(/-/g).join('') // 6位随机数
      + this.randomInRange(100000, 999999);
    };

    _.formatDate = function (format, date) {
      if (date === void 0) {
        date = new Date();
      }

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
        } else if (t === 'y') {
          return (date.getFullYear() + '').substr(4 - all.length);
        } else if (t === 'S') {
          var ms = "00" + date.getMilliseconds();
          return ms.substr(ms.length - 3);
        }

        return all;
      });
      return format;
    };

    _.randomInRange = function (min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    };

    var visit = _.createVisitId('SPKF');

    console.log('访客码： ', visit); // 初始化 -> 校验签名是否合法
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

    console.log(sayHello('1234'));

    var HXAnalytics =
    /** @class */
    function () {
      function HXAnalytics(config) {}

      HXAnalytics.prototype._report = function () {};

      HXAnalytics.prototype._changeMode = function () {};

      HXAnalytics.prototype.init = function () {
        return this;
      };

      HXAnalytics.prototype.push = function () {};

      return HXAnalytics;
    }();

    var ha = new HXAnalytics();

    return ha;

}));
//# sourceMappingURL=hx-analytics-jssdk.js.map
