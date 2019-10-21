import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { message } from './native';

// // 自定义事件 | 页面初始化后的性能数据上报
// export const performance: () => Observable<Event> =
//     () => {

//     }

// // 自定义事件 | 上报页面停留时长数据
// export const tp: () => Observable<Event> =
//     () => {
    
//     }

// 切换模式相关 切换至浏览模式 切换至埋点模式（附带preset）
// 埋点流程相关
    

// 自定义事件 | message分流
// 推送已埋埋点
    // msg: {
    //     data: {
    //         tag: 'mode',
    //         mode: 'setting',
    //         points: PointBase[]
    //     }
    // }
// 重置（包括 鼠标移出区域、点击重置按钮）
    // msg: {
    //     data: {
    //         tag: 'reset'
    //     }
    // }
export const messageOf: (tag: string) => Observable<MessageEvent> =
    tag => message().pipe(
        filter((msg: MessageEvent) => <'setting' | 'browse'>msg.data.tag === tag)
    );
