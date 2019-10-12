var CatchLifeCycle = /** @class */ (function () {
    function CatchLifeCycle() {
    }
    CatchLifeCycle.prototype.init = function (config) {
        this.config = config;
        // 初始化事件消费者catch
        // this.onEnter
        this.onEnter();
    };
    CatchLifeCycle.prototype.onEnter = function () {
        // 切换当前事件消费者为catch
    };
    CatchLifeCycle.prototype.onExit = function () {
    };
    return CatchLifeCycle;
}());
;
export default CatchLifeCycle;
