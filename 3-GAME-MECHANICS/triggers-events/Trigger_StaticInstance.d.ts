import { Component } from 'horizon/core';
export declare class StaticInstance extends Component<typeof StaticInstance> {
    static instance: StaticInstance;
    constructor();
    preStart(): void;
    start(): void;
    doSomething(): void;
}
