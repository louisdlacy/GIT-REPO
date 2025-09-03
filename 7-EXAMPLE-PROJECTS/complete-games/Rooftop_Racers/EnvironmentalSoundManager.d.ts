/**
 * Controls the playing of sounds that are heard by all players throughout the world, based on the game state.
 * Examples include the countdown to race start.
 */
import * as hz from 'horizon/core';
export declare class EnvironmentalSoundManager extends hz.Component<typeof EnvironmentalSoundManager> {
    static propsDefinition: {
        LobbyBGAudio: {
            type: "Entity";
        };
        LobbyReadyUpBGAudio: {
            type: "Entity";
        };
        RaceBGAudio: {
            type: "Entity";
        };
        countdown10VO: {
            type: "Entity";
        };
        countdown3VO: {
            type: "Entity";
        };
        countdown2VO: {
            type: "Entity";
        };
        countdown1VO: {
            type: "Entity";
        };
        matchStartedVO: {
            type: "Entity";
        };
        matchEndingVO: {
            type: "Entity";
        };
        matchEndedVO: {
            type: "Entity";
        };
    };
    private static s_instance;
    static getInstance(): EnvironmentalSoundManager;
    constructor();
    LobbyBGAudio: hz.AudioGizmo | null;
    LobbyReadyUpBGAudio: hz.AudioGizmo | null;
    RaceBGAudio: hz.AudioGizmo | null;
    countdown1VO: hz.AudioGizmo | null;
    countdown2VO: hz.AudioGizmo | null;
    countdown3VO: hz.AudioGizmo | null;
    countdown10VO: hz.AudioGizmo | null;
    matchStartedVO: hz.AudioGizmo | null;
    matchEndedVO: hz.AudioGizmo | null;
    matchEndingVO: hz.AudioGizmo | null;
    readonly BGMAudioOptions: hz.AudioOptions;
    readonly VOAudioOptions: hz.AudioOptions;
    preStart(): void;
    start(): void;
}
