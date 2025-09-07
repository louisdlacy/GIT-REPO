export declare enum StateCallbacks {
    None = 0,
    OnEnter = 1,
    OnUpdate = 2,
    OnExit = 3
}
export declare class StateCallbackConfig {
    callbackType: StateCallbacks;
    callback: Function;
    constructor(callbackType: StateCallbacks, callback: Function);
}
export declare class NextStateEdges {
    condition: Function;
    possibleStates: [string, number][];
    constructor(condition: Function, possibleStates?: [string, number][]);
}
export declare class StateConfigRecord {
    name: string;
    callbacks: StateCallbackConfig[];
    nextStateEdges: NextStateEdges[];
    constructor(name: string, callbacks?: StateCallbackConfig[], nextStateEdges?: NextStateEdges[]);
}
declare class State {
    name: string;
    onEnterCallback: Function;
    onUpdateCallback: Function;
    onExitCallback: Function;
    nextStateEdges: NextStateEdges[];
    constructor(name: string, onEnterCallback?: () => void, onUpdateCallback?: (deltaTime: Number) => void, onExitCallback?: () => void, nextStateEdges?: NextStateEdges[]);
}
export declare class StateMachine {
    private stateMap;
    private isLogging;
    currentState: State | undefined;
    isActive: boolean;
    timer: number;
    constructor(stateArray: string[], configArray: StateConfigRecord[], enableLogging?: boolean);
    changeState(stateName: string): void;
    update(deltaTime: number): void;
    private config;
    private chooseNextState;
}
export {};
