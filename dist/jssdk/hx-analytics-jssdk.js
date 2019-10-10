
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(document);
(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}(function () { 'use strict';

    function sayHello(name) {
      return "Hello from tstest " + name;
    }

    // 2. 

    console.log(sayHello('1234'));

}));
//# sourceMappingURL=hx-analytics-jssdk.js.map
