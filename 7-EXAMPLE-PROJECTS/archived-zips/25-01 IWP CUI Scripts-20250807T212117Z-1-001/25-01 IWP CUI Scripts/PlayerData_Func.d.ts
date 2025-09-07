import { Player } from "horizon/core";
import { PlayerData } from "PlayerData_Defs";
export declare const playerData_Func: {
    createEmptyPlayerData: typeof createEmptyPlayerData;
    updateTimeSpent: typeof updateTimeSpent;
    updatePlayerPositions: typeof updatePlayerPositions;
};
declare function createEmptyPlayerData(player: Player | undefined): PlayerData;
declare function updateTimeSpent(): void;
declare function updatePlayerPositions(): void;
export {};
