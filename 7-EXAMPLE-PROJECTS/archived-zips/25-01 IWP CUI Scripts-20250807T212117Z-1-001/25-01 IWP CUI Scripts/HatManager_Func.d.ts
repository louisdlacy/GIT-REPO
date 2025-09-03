import { HatAssetData } from "HatManager_Defs";
import { Player } from "horizon/core";
import { PlayerData } from "PlayerData_Defs";
export declare const hatManager_Func: {
    spawnHat: typeof spawnHat;
    setHatVisibility: typeof setHatVisibility;
    setHatColor: typeof setHatColor;
};
declare function spawnHat(player: Player, playerData: PlayerData, hat: HatAssetData): Promise<void>;
declare function setHatVisibility(player: Player, isVisible: boolean): void;
declare function setHatColor(player: Player, playerData: PlayerData, color: string): void;
export {};
