/**
 * Manages the player local OOB controllers, initializing them and controlling ownership
 */
import * as hz from 'horizon/core';
export declare class PlayerOOBManager extends hz.Component<typeof PlayerOOBManager> {
    static propsDefinition: {
        recordIntervalMS: {
            type: "number";
            default: number;
        };
        OOBWorldYHeight: {
            type: "number";
            default: number;
        };
        bufferRespawnYHeight: {
            type: "number";
            default: number;
        };
        lobbyStartRespawnGizmo: {
            type: "Entity";
        };
    };
    private asyncIntervalID;
    private localRespawnerPool;
    private playerMap;
    private respawnVecBuffer;
    private lastKnownGameState;
    private lobbyStartRespawnGizmo;
    private static s_instance;
    static getInstance(): PlayerOOBManager;
    constructor();
    preStart(): void;
    start(): void;
    private handleOnPlayerEnterWorld;
    private handleOnPlayerExitWorld;
    dispose(): void;
}
