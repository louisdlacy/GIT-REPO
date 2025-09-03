export declare class Throttler {
    static propsDefinition: {};
    static throttleMap: Map<string, bigint>;
    static try(key: string, functionToThrottle: Function, delay: number): void;
}
