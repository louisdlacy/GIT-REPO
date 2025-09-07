import { Player } from "horizon/core";
import { PlayerStats } from "PlayerStats_Defs";
export declare const playerStats_Func: {
    getPlayerStatsFromPPV: typeof getPlayerStatsFromPPV;
    updatePPVAndLeaderboards: typeof updatePPVAndLeaderboards;
};
declare function getPlayerStatsFromPPV(player: Player): PlayerStats;
declare function updatePPVAndLeaderboards(player: Player): void;
export {};
