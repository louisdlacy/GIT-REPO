import { Behaviour } from 'Behaviour';
import { GamePlayers } from 'GameUtils';
import { Player, Vec3 } from 'horizon/core';
export declare class PlayerManager extends Behaviour<typeof PlayerManager> {
    static propsDefinition: {
        matchSpawnPoint: {
            type: "Entity";
        };
        lobbySpawnPoint: {
            type: "Entity";
        };
        playerMaxHp: {
            type: "number";
            default: number;
        };
        respawnInvincibibilityMs: {
            type: "number";
            default: number;
        };
        playerStartAmmo: {
            type: "number";
            default: number;
        };
        ammoPerBox: {
            type: "number";
            default: number;
        };
        healthPerPotion: {
            type: "number";
            default: number;
        };
        knockbackForceOnHit: {
            type: "number";
            default: number;
        };
        hitScream: {
            type: "Entity";
        };
        hudPool: {
            type: "Entity";
        };
    };
    private hudPool;
    static instance: PlayerManager;
    gamePlayers: GamePlayers;
    Awake(): void;
    Start(): void;
    hitPlayer(player: Player, damage: number, damageOrigin: Vec3): void;
    private handleOnPlayerEnterWorld;
    private handleOnPlayerExitWorld;
    resetAllPlayers(): void;
    private moveAllMatchPlayersToLobby;
    private movePlayerFromMatchToLobby;
    private resetAllPlayersHUD;
    private updatePlayerHUD;
    private handleLootPickup;
}
