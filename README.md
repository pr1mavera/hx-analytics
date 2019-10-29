# hx-analytics

> 华夏保险官微行为数据采集sdk

## Build Setup

``` bash
# install dependencies
npm install

# script reload at http://localhost:3001/jssdk/hx-analytics.js
npm run jssdk:dev

# build for production with minification
npm run jssdk:prod
```

## Integrated (provisional)

1. 引入脚本

    引入方式目前仅支持标签引入，后续会考虑支持 npm 包引入
    ``` html
    ...
    <!-- 在文档头部引入临时 cdn 地址 -->

    <!-- 调试版本，带 source map ，建议调试阶段尽量使用该版本 -->
    <script src="https://sales-dev.ihxlife.com/video/hx-analytics/jssdk/hx-analytics.js"></script>
    <!-- 生产版本 -->
    <script src="https://sales-dev.ihxlife.com/video/hx-analytics/jssdk/hx-analytics.umd.min.js"></script>
    ...
    ```

2. 行为数据收集模块初始化

    在引入脚本之后的任意位置，初始化行为数据收集模块，需传入应用码及 openId
    ``` js
    ... Do something ...

    getDataFromSomeAPI().then(data => {
        ha.init({
            appId: data.appId,
            openId: data.openId
        })
    })
    ... Do something ...
    ```

    初始化完成之后，收集模块将自动收集用户行为的全量日志
