/* eslint-disable no-undef */
const env = process.env.NODE_ENV;

const production = {
    // 'public': 'https://112.74.159.153:8085/api/v1'
    'public': 'https://video-uat.ihxlife.com:8085/api/v1'
};

const development = {
    // 'public': 'https://112.74.159.153:8085/api/v1'
    'public': 'https://video-uat.ihxlife.com:8085/api/v1'
};

export default env === 'production' ? production : development;





// // 改写思路：
// // 拷贝 window 默认的 replaceState 函数，重写 history.replaceState 在方法里插入我们的采集行为
// // 在重写的 replaceState 方法最后调用，window 默认的 replaceState 方法

// var collect = {}

// collect.onPushStateCallback = function() {} // 自定义的采集方法

// (function(history) {
//     var replaceState = history.replaceState;   // 存储原生 replaceState
//     history.replaceState = function(state, param) {     // 改写 replaceState
//         var url = arguments[2];
//         if (typeof collect.onPushStateCallback == "function") {
//             collect.onPushStateCallback({state: state, param: param, url: url});   //自定义的采集行为方法
//         }
//         return replaceState.apply(history, arguments);    // 调用原生的 replaceState
//     };
// })(window.history);
