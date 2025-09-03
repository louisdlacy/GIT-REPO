/**
 * Game-wide enums and constants. Advanced curve functions and their visualizer
 */
import * as hz from "horizon/core";
export declare enum GameState {
    "ReadyForMatch" = 0,// Default, nothing is going on, we can start a match
    "StartingMatch" = 1,//A match has been started by players
    "PlayingMatch" = 2,//A match is ongoing
    "EndingMatch" = 3,//A match is ending
    "CompletedMatch" = 4
}
export declare enum PlayerGameStatus {
    "Lobby" = 0,
    "Standby" = 1,
    "Playing" = 2
}
export declare class Pool<T> {
    all: T[];
    available: T[];
    active: T[];
    hasAvailable(): boolean;
    hasActive(): boolean;
    isAvailable(t: T): boolean;
    getNextAvailable(): T | null;
    getRandomAvailable(): T | null;
    getRandomActive(): T | null;
    addToPool(t: T): void;
    removeFromPool(t: T): void;
    resetAvailability(): void;
}
export declare function msToMinutesAndSeconds(time: number): string;
export declare function timedIntervalActionFunction(timerMS: number, component: hz.Component, onTickAction: (timerMS: number) => void, // Function to be run during the timer tick
onEndAction: () => void): number;
export declare class Curve {
    private _controlPoints;
    get controlPoints(): hz.Vec3[];
    private set controlPoints(value);
    constructor(controlPoints: hz.Vec3[]);
    interpolate(t: number): hz.Vec3;
    findClosestPointCurveProgress(target: hz.Vec3): number;
    private interpolateCatmullRom;
    private goldenSectionSearch;
    private calculateDistance;
}
export declare class CurveVisualizer extends hz.Component<typeof CurveVisualizer> {
    static propsDefinition: {
        showPath: {
            type: "boolean";
        };
        trailRenderer: {
            type: "Entity";
        };
    };
    static SetCurve: hz.LocalEvent<{
        curve: Curve;
    }>;
    static StartDrawingCurve: hz.LocalEvent<Record<string, never>>;
    static StopDrawingCurve: hz.LocalEvent<Record<string, never>>;
    private splineProgress;
    private curve;
    private showPath;
    preStart(): void;
    start(): void;
    private drawTrackWithProgress;
}
