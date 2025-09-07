/**
 * This manager is responsible for tracking the player progress around the race and the race UI
 */
import * as hz from 'horizon/core';
export declare class RaceManager extends hz.Component<typeof RaceManager> {
    static propsDefinition: {
        startLineRaceUI: {
            type: "Entity";
        };
        finishLineRaceUI: {
            type: "Entity";
        };
        trackPointsParent: {
            type: "Entity";
        };
        curveVisualizer: {
            type: "Entity";
        };
    };
    private raceUpdateIntervalID;
    private raceCurve;
    private raceParticipants;
    private raceWinners;
    private matchTime;
    private startLineRaceUI;
    private finishLineRaceUI;
    private readonly defaultRaceUIText;
    private static s_instance;
    static getInstance(): RaceManager;
    constructor();
    preStart(): void;
    start(): void;
    private handleOnMatchStart;
    private updateAllRacerCurveProgress;
    private handleOnMatchEnd;
    private handleOnPlayerLeftMatch;
    private initCurve;
    private handleUpdateRaceUI;
    private playerFinishedRace;
    private getWinnerRollCallString;
    private reset;
    dispose(): void;
}
