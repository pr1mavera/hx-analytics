interface Utils {
    (): Utils;
    inIframe: () => boolean;
    isType: (type: string, staff: any) => boolean
    createVisitId: (this: Utils, appId: string) => string;
    formatDate: (format: string, date?: Date) => string;
    randomInRange: (min: number, max: number) => number;
}

type RequestMethods = 'DELETE' | 'GET' | 'HEAD' | 'POST' | 'PUT';
interface RequestOptions {
    headers?: object;
    [propName: string]: any;
}
type SafeRequest = {
    setHeader: (newHeader: object) => void;
    get: (host: string, url: string, options?: RequestOptions) => Promise<any>;
    post: (host: string, url: string, data: object | null, options?: RequestOptions) => Promise<any>;
    put: (host: string, url: string, data: object | null, options?: RequestOptions) => Promise<any>;
    delete: (host: string, url: string, options?: RequestOptions) => Promise<any>;
    url: (host: string, url: string) => string;
}
interface SafeRequestEntry {
    (
        method: RequestMethods,
        url: string,
        data: object | null,
        option?: RequestOptions
    ): Promise<any>
}