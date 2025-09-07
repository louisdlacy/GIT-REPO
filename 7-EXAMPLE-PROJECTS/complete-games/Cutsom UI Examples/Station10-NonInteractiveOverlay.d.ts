import * as hz from 'horizon/core';
export declare const GameStart: hz.NetworkEvent<{
    timeMS: number;
}>;
export declare const GameOver: hz.NetworkEvent<{
    timeMS: number;
}>;
export declare const TimerStart: hz.NetworkEvent<{
    timeMS: number;
}>;
export declare const TimerEnd: hz.NetworkEvent<{
    timeMS: number;
}>;
export declare function fctnTimedIntervalAction(timerMS: number, component: hz.Component, onTickAction: (timerMS: number) => void, onEndAction: () => void): number;
