import { Player } from "horizon/core";
import { PlayerData } from "PlayerData_Defs";
export declare const ppvLeaderboard_Func: {
    updatePPVAndLeaderboards: typeof updatePPVAndLeaderboards;
    updatePPV: typeof updatePPV;
};
declare function updatePPVAndLeaderboards(player: Player): void;
declare function updatePPV(player: Player, playerData: PlayerData): void;
export {};
