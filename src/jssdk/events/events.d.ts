// // Type definitions for AppEvent
// // Project: hx-analytics
// // Definitions by: pr1mavera pr1mavera.w4ng@gmail.com

// export as namespace AppEvent;

// /**
//  * 原生事件监听器
//  * 
//  * @see 包括monkeyPatch自定义派发的事件
//  */
// export interface NativeEvent {

//     /**
//      * 点击
//      * 
//      * @param {Obj} config 事件修饰参数
//      */
//     click: (config: Obj) => any;

//     /**
//      * 鼠标滑动
//      * 
//      * @param {Obj} config 事件修饰参数
//      */
//     mousemove: (config: Obj) => any;

//     /**
//      * 页面加载
//      */
//     load: () => any;

//     /**
//      * 页面卸载前
//      */
//     beforeUnload: () => any;

//     /**
//      * 移动设备页面加载显示
//      */
//     pageShow: () => any;

//     /**
//      * 移动设备页面卸载隐藏
//      */
//     pageHide: () => any;

//     /**
//      * hash值变化
//      */
//     hashchange: () => any;

//     /**
//      * 注册的history
//      */
//     popstate: () => any;

//     /**
//      * 
//      */
//     pushState: () => any;

//     /**
//      * 
//      */
//     replaceState: () => any;

//     /**
//      * 
//      */
//     visibilitychange: () => any;

//     /**
//      * 
//      */
//     online: () => any;

//     /**
//      * 
//      */
//     offline: () => any;

//     /**
//      * 
//      */
//     message: () => any;

// }

// /**
//  * 衍生事件监听器
//  * 
//  * @see 由原生事件衍生
//  */
// export interface CustomEvent {

//     /**
//      * 
//      */
//     messageOf: (tag: string) => any;

//     /**
//      * 
//      */
//     netStatusChange: () => any;

//     /**
//      * 
//      */
//     routeChange: () => any;

//     /**
//      * 
//      */
//     pageVisible: () => any;

//     /**
//      * 
//      */
//     pageHidden: () => any;

// }