/**
 * Controls the overall game state of the world, listening to events occurring and transiting the game state accordingly
 */
import * as hz from 'horizon/core';
export declare class GameManager extends hz.Component<typeof GameManager> {
    static propsDefinition: {
        startLineGameStateUI: {
            type: "Entity";
        };
        finishLineGameStateUI: {
            type: "Entity";
        };
        timeToMatchStartMS: {
            type: "number";
            default: number;
        };
        timeToMatchEndMS: {
            type: "number";
            default: number;
        };
        timeNewMatchReadyMS: {
            type: "number";
            default: number;
        };
        minTimeToShowStartPopupsMS: {
            type: "number";
            default: number;
        };
        minTimeToShowEndPopupsMS: {
            type: "number";
            default: number;
        };
        playersNeededForMatch: {
            type: "number";
            default: number;
        };
    };
    private currentGameState;
    private startMatchTimerID;
    private endMatchTimerID;
    private newMatchTimerID;
    private startLineGameStateUI;
    private finishLineGameStateUI;
    static s_instance: GameManager;
    constructor();
    preStart(): void;
    start(): void;
    private transitGameState;
    private transitFromStartingToReady;
    private transitFromCompletedToReady;
    private transitFromReadyToStarting;
    private transitFromStartingToPlaying;
    private transitFromPlayingToEnding;
    private transitFromEndingToCompleted;
    private updateGameStateUI;
    private reset;
    dispose(): void;
}
