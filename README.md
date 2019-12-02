# hx-analytics

> 华夏保险官微行为数据采集sdk

## docs

+ 接入文档 [https://pr1mavera.github.io/hx-analytics/%E8%A1%8C%E4%B8%BA%E6%94%B6%E9%9B%86%E6%8E%A5%E5%85%A5%E6%89%8B%E5%86%8C.html](https://pr1mavera.github.io/hx-analytics/%E8%A1%8C%E4%B8%BA%E6%94%B6%E9%9B%86%E6%8E%A5%E5%85%A5%E6%89%8B%E5%86%8C.html)
+ 开发文档 [https://pr1mavera.github.io/hx-analytics/%E5%BC%80%E5%8F%91%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9.html](https://pr1mavera.github.io/hx-analytics/%E5%BC%80%E5%8F%91%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9.html)

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

sdk地址:
+ int: [http://sales-int.ihxlife.com/sdk/hx-analytics/jssdk/hx-analytics.js](http://sales-int.ihxlife.com/sdk/hx-analytics/jssdk/hx-analytics.js)
+ uat: [http://sales-dev.ihxlife.com/sdk/hx-analytics/jssdk/hx-analytics.js](http://sales-dev.ihxlife.com/sdk/hx-analytics/jssdk/hx-analytics.js)
+ 生产: [http://sales.ihxlife.com/sdk/hx-analytics/jssdk/hx-analytics.umd.min.js](http://sales.ihxlife.com/sdk/hx-analytics/jssdk/hx-analytics.umd.min.js)

1. 引入脚本

    ``` html
    ...
    <!-- 在文档头部引入 cdn 地址 -->
    <script>
        // 指令集（在任何 行为收集SDK 相关代码之前初始化）
        var ha = ha || [];
        // 异步引入脚本
        (function () {
            var ha = document.createElement('script');
            ha.type = 'text/javascript';
            ha.async = true;
            ha.src = '对应版本地址';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ha, s);
        })();
    </script>
    ...
    ```

2. 传入行为数据收集模块初始化指令

    在任意位置，初始化行为数据收集模块
    ``` js
    ha.push([
        'init', /*                          指令 */
        'kzgm', /*                          appId，以真实 appId 为准 */
        'kfxt', /*                          sysId，以真实 sysId 为准 */
        'oKXX7wKQhDf0sixuV0z-gEB8Y8is' /*   openId，以真实 openId 为准 */
    ]);
    ```

    初始化完成之后，收集模块将自动收集用户行为的全量日志

::: warning
请确保指令集 `var ha = ha || [];` 的初始化在任何 行为收集SDK 相关代码之前，其余随意
:::
