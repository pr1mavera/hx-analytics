interface ModeLifeCycle {
    mode: string,
    config?: object,
    init: (this: ModeLifeCycle, config?: object) => void,
    onEnter: (this: ModeLifeCycle) => void,
    onExit: (this: ModeLifeCycle) => void
}

class CatchLifeCycle implements ModeLifeCycle {
    readonly mode: 'catch';
    config: object;
    init(config: object) {
        this.config = config;
        // 初始化事件消费者catch
        // this.onEnter
        this.onEnter();
    }
    onEnter() {
        // 切换当前事件消费者为catch
    }
    onExit() {

    }
};

export default CatchLifeCycle;