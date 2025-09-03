/**
 * Moves players between match states, based on that match state, teleports them around as needed
 */
import * as hz from 'horizon/core';
import { PlayerGameStatus } from 'GameUtils';
export interface PlayerData {
    player: hz.Player;
    playerGameStatus: PlayerGameStatus;
}
export declare class MatchManager extends hz.Component<typeof MatchManager> {
    static propsDefinition: {
        lobbySpawnPoint: {
            type: "Entity";
        };
        matchSpawnPoint: {
            type: "Entity";
        };
    };
    private lastKnownGameState;
    private playerMap;
    private static s_instance;
    static getInstance(): MatchManager;
    constructor();
    subscriptions: Array<hz.EventSubscription>;
    preStart(): void;
    start(): void;
    getPlayersWithStatus(playerGameStatus: PlayerGameStatus): Array<hz.Player>;
    private handleGameStateTransit;
    private handleOnPlayerExitWorld;
    private handleOnPlayerEnterWorld;
    private handlePlayerRegisterStandby;
    private handlePlayerDeregisterStandby;
    private transferAllPlayersWithStatus;
    private transferPlayerWithStatus;
    private teleportPlayersWithStatusToSpawnPoint;
    private reset;
    dispose(): void;
}
