---
title: 项目结构、UML类图及说明
---

## 目录结构

+ build/ ---- 项目编译配置
+ config/ ---- 应用配置（开发相关配置）
+ dist/ ---- 开发、生产脚本
+ docs/ ---- 文档
+ script/ ---- 编译相关shell
+ src/ ---- 源码
    + config/ ---- API主机配置
    + jssdk/ ---- jssdk相关逻辑
        + events/ ---- 浏览器环境基础事件监控
        + service/ ---- 浏览器环境服务API
        + HXAnalytics.ts ---- hx-analytics类
        + inversify.config.ts ---- IoC容器注册
        + types.ts ---- 容器字典
    + mode/ ---- 模式相关逻辑
        + browse/ ---- 浏览模式
        + report/ ---- 事件上报模式
            + middleware/ ---- 事件上报相关中间件
            + MsgsQueue.ts ---- 消息队列
            + PageTracer.ts ---- 页面停留时长监控
            + Report.ts ---- 事件上报集合
            + ReportStrategy.ts ---- 上报策略
        + setting/ ---- 埋点配置模式
            + CustomCanvas.ts ---- 自定义canvas构造器
            + DomMasker.ts ---- 埋点捕捉蒙板
            + Setting.ts ---- 埋点配置集合
    + typings/ ---- ts类型文件
    + utils/ ---- 公共类库
        + AppConfig.ts ---- 运行时系统相关配置，提供
        + EventSubscriber.ts ---- 事件注册中心
        + Point.ts ---- 埋点构造器
        + utils.ts ---- 公共函数库
    + entry-jssdk.ts ---- jssdk入口

## UML



## 依赖注入方式

项目依赖 typescript ，使用 [inversify](https://www.npmjs.com/package/inversify) 实现依赖注入，开发时请遵循以下规则
+ 所有业务相关抽象类之间应尽量保持无依赖关系
+ 抽象类应先在 `src/inversify.config.ts` 中注册至容器，再在业务逻辑中使用 `@inject` 注入该依赖

## 基础类接口说明

### HXAnalytics

#### `private` _mode
+ `@desc` - 当前活跃模式引用，每个模式都有自己的生命周期
+ *get* mode
    + `@desc` - 获取模式类型
    + `@return` - 当前模式模式类型（字符串）
+ *set* mode
    + `@desc` - 设置模式类型，会退出上一个模式（onExit），并进入传入的模式（onEnter）
    + `@param` modeType:string - 模式类型（字符串）
    + `@return` - void

#### `private` modeContainer
+ `@desc` - 模式容器，设置当前模式的时候会根据模式字符串从该容器内获取对应模式

#### `private` init
+ `@desc` - 用户信息存贮及模式初始化
+ `@param` user:string[] - 登录用户信息，参数顺序：appId, sysId, openId （保持与初始化指令一致）

#### push
+ `@desc` - 主动事件指令推送（提供给接入sdk的开发人员）
+ `@param` - 参数详见[指令系统](/指令系统.html)

### AppConfig
### EventSubscriber
### Point