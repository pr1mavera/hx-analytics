type Obj = { [ x: string ]: any };

// 工具类
interface Utils {
    (): Utils;
    inIframe: () => boolean;
    isType: (type: string, staff: any) => boolean
    createVisitId: (this: Utils, appId: string) => string;
    formatDate: (format: string, date?: Date) => string;
    randomInRange: (min: number, max: number) => number;
    mixins: (...list: object[]) => (...x: any[]) => void;
}

// 单个模式的生命周期
interface ModeLifeCycle<T> {
    readonly modeType: string;
    events?: object;
    onEnter: (this: T) => void;
    onExit: (this: T) => void;
    onTrigger: (this: T) => void;
}

// 请求方式
type RequestMethods = 'DELETE' | 'GET' | 'HEAD' | 'POST' | 'PUT';
// 请求额外选项
interface RequestOptions {
    headers?: object;
    [propName: string]: any;
}
// 请求
type SafeRequest = {
    setHeader: (newHeader: object) => object;
    get: (host: string, url: string, options?: RequestOptions) => Promise<any>;
    post: (host: string, url: string, data: object | null, options?: RequestOptions) => Promise<any>;
    put: (host: string, url: string, data: object | null, options?: RequestOptions) => Promise<any>;
    delete: (host: string, url: string, options?: RequestOptions) => Promise<any>;
    url: (host: string, url: string) => string;
}

// 全局容器
interface Container {
    mode: {
        [ key: string ]: ModeLifeCycle<any>;
    };
}