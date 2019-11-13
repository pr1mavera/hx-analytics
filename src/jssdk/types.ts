const TYPES = {
    HXAnalytics: Symbol.for('HXAnalytics'),

    // 应用事件层
    AppEvent: Symbol.for('AppEvent'),
    // 全局工具
    Utils: Symbol.for('Utils'),
    // API
    Service: Symbol.for('Service'),
    // 应用配置相关信息
    Conf: Symbol.for('Config'),

    // 模式
    Browse: Symbol.for('Browse'),
    Setting: Symbol.for('Setting'),
    Report: Symbol.for('Report'),
    ModeContainer: Symbol.for('ModeContainer'),

    // 事件订阅器集合
    EventSubscriber: Symbol.for('EventSubscriber'),

    // 上报策略（远程服务 / 本地缓存）
    ReportStrategy: Symbol.for('ReportStrategy'),
    // 消息队列
    MsgsQueue: Symbol.for('MsgsQueue'),

    // 埋点配置相关类型
    DomMasker: Symbol.for('DomMasker'),
    CustomCanvas: Symbol.for('CustomCanvas'),
    Point: Symbol.for('Point')
}
export default TYPES;